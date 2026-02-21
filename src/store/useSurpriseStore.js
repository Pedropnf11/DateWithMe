// ── Store ISOLADA do Modo Surpresa ─────────────────────────────────────────
// Zero interferência com useQuizStore ou qualquer outra store

import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useSurpriseStore = create((set, get) => ({
  // Estado do fluxo
  currentStep: 'activity', // 'activity' | 'details' | 'clues' | 'message'
  activities: [],     // Array de objetos do tipo {id, label, emoji, clues}
  customActivityName: '', // Nome personalizado se activity.id === 'custom'
  dateOptions: [{ date: '', time: '20:00' }],
  location: '',
  clues: [],
  message: '',

  // Setters
  setStep: (step) => set({ currentStep: step }),
  toggleActivity: (activity) => set(s => {
    const isSelected = s.activities.some(a => a.id === activity.id);
    const newActivities = isSelected
      ? s.activities.filter(a => a.id !== activity.id)
      : [...s.activities, activity];

    // Autofill clues from all selected activities
    const allClues = Array.from(new Set(newActivities.flatMap(a => a.clues || [])));

    return {
      activities: newActivities,
      clues: allClues.length > 0 ? allClues : s.clues,
      location: newActivities.map(a => a.label).join(' & ') || s.location
    };
  }),
  setCustomActivityName: (name) => set({ customActivityName: name }),
  addDateOption: (opt = { date: '', time: '20:00' }) => set(s => ({ dateOptions: [...s.dateOptions, opt] })),
  removeDateOption: (idx) => set(s => ({ dateOptions: s.dateOptions.filter((_, i) => i !== idx) })),
  updateDateOption: (idx, val) => set(s => {
    const copy = [...s.dateOptions];
    copy[idx] = { ...copy[idx], ...val };
    return { dateOptions: copy };
  }),

  setLocation: (location) => set({ location }),
  setClues: (clues) => set({ clues }),
  addClue: (text) => set(s => ({ clues: [...s.clues, text] })),
  removeClue: (idx) => set(s => ({ clues: s.clues.filter((_, i) => i !== idx) })),
  setMessage: (message) => set({ message }),

  // Reset
  reset: () => set({
    currentStep: 'activity',
    activities: [],
    customActivityName: '',
    dateOptions: [{ date: '', time: '20:00' }],
    location: '',
    clues: [],
    message: '',
  }),

  // Guardar na DB
  saveInvite: async () => {
    const { dateOptions, location, clues, message, activities, customActivityName } = get();

    if (!location.trim()) return { error: 'Adiciona o local secreto!' };
    if (clues.length < 3) return { error: 'Adiciona pelo menos 3 pistas!' };
    if (dateOptions.some(opt => !opt.date)) return { error: 'Preenche todas as datas!' };

    const activityNames = activities.map(a => a.id === 'custom' ? customActivityName : a.label);
    const finalActivityName = activityNames.join(' & ');

    const content = {
      templateId: 'surprise',
      activityName: finalActivityName,
      dateOptions,
      location: location.toUpperCase().trim(),
      clues,
      message,
    };

    // Usar RPC segura que devolve creator_key sem expor via SELECT público
    const { data, error } = await supabase
      .rpc('create_invite', { p_content: content });

    if (error) {
      if (import.meta.env.DEV) console.error('Supabase Error:', error);
      return { error: 'Erro ao criar convite surpresa. Tenta novamente.' };
    }

    const invite = Array.isArray(data) ? data[0] : data;

    // Security Fix: Store key in local storage (persistent across tabs/browser close)
    localStorage.setItem(`ck_${invite.id}`, invite.creator_key);

    return {
      success: true,
      id: invite.id,
      publicLink: `/surpresa/${invite.id}`,
      privateLink: `/resultado/${invite.id}`,
    };
  },
}));

export default useSurpriseStore;
