import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Plus, Trash2, ChevronRight, Check, Clock, Sparkles, X, ArrowLeft, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useSurpriseStore from '../store/useSurpriseStore';
import TimePickerOverlay from '../components/Invite/Steps/TimePickerOverlay';
import { ACTIVITY_PRESETS } from '../data/templateSurprise';
import { useNavigate } from 'react-router-dom';
import { buildCalendarDays, WEEKDAYS, MONTH_NAMES } from '../utils/calendarUtils';
// Calendar helpers moved to utils/calendarUtils.js

export default function SurpriseCreate() {
    const navigate = useNavigate();
    const {
        currentStep,
        activities,
        dateOptions,
        location,
        clues,
        message,
        setStep,
        toggleActivity,
        setActivity,
        addDateOption,
        removeDateOption,
        updateDateOption,
        setLocation,
        addClue,
        removeClue,
        setMessage,
        customActivityName,
        setCustomActivityName,
        saveInvite,
        reset
    } = useSurpriseStore();

    const [isSaving, setIsSaving] = useState(false);
    const [createdId, setCreatedId] = useState(null);
    const [editingIndex, setEditingIndex] = useState(0);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const [showCustomPopup, setShowCustomPopup] = useState(false);

    const calendarDays = buildCalendarDays();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const end30 = new Date(today); end30.setDate(today.getDate() + 30);

    const toggleDate = (dateStr) => {
        const existingIdx = dateOptions.findIndex(d => d.date === dateStr);
        if (existingIdx >= 0) {
            if (dateOptions.length > 1) {
                removeDateOption(existingIdx);
                // Ajustar index de edição se necessário
                if (editingIndex >= existingIdx) {
                    setEditingIndex(Math.max(0, editingIndex - 1));
                }
            }
        } else {
            // Se a primeira opção estiver vazia, substitui em vez de adicionar
            if (dateOptions.length === 1 && !dateOptions[0].date) {
                updateDateOption(0, { date: dateStr });
            } else {
                addDateOption({ date: dateStr, time: '20:00' });
                setEditingIndex(dateOptions.length);
            }
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await saveInvite();
        setIsSaving(false);
        if (result.id) setCreatedId(result.id);
        else alert(result.error);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 'activity':
                return (
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-black text-gray-800 uppercase tracking-tighter italic">O QUE VAMOS FAZER? 🎲</h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">Podes selecionar mais do que 1 atividade!</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {ACTIVITY_PRESETS.map(t => {
                                const isSel = activities.some(a => a.id === t.id);
                                return (
                                    <motion.button
                                        key={t.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleActivity(t)}
                                        className={`p-6 rounded-[2.5rem] border-4 transition-all text-center space-y-3 relative overflow-hidden group
                    ${isSel ? 'border-pink-500 bg-pink-50 shadow-xl shadow-pink-100' : 'border-gray-100 bg-white hover:border-pink-200'}`}
                                    >
                                        <div className="text-4xl group-hover:scale-110 transition-transform">{t.emoji}</div>
                                        <p className="text-xs font-black text-gray-800 uppercase tracking-tighter">{t.label}</p>
                                        {isSel && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-md">
                                                <Check size={14} strokeWidth={4} />
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    const isCustomSel = activities.some(a => a.id === 'custom');
                                    if (isCustomSel) {
                                        toggleActivity({ id: 'custom' });
                                    } else {
                                        setShowCustomPopup(true);
                                    }
                                }}
                                className={`p-6 rounded-[2.5rem] border-4 transition-all text-center space-y-3 relative overflow-hidden group
                    ${activities.some(a => a.id === 'custom') ? 'border-pink-500 bg-pink-50 shadow-xl shadow-pink-100' : 'border-gray-100 bg-white border-dashed hover:border-pink-200'}`}
                            >
                                <div className="text-4xl group-hover:scale-110 transition-transform">✨</div>
                                <p className="text-xs font-black text-gray-800 uppercase tracking-tighter">Personalizar</p>
                                {activities.some(a => a.id === 'custom') && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-md">
                                        <Check size={14} strokeWidth={4} />
                                    </div>
                                )}
                            </motion.button>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => setStep('details')}
                                disabled={activities.length === 0}
                                className="w-full py-6 bg-gray-800 text-white font-black text-[13px] uppercase tracking-[0.2em] rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30"
                            >
                                PRÓXIMO PASSO <ChevronRight size={18} className="inline ml-2" />
                            </button>
                        </div>

                        {/* Custom Activity Modal */}
                        <AnimatePresence>
                            {showCustomPopup && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                                        onClick={() => setShowCustomPopup(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl border border-pink-50 space-y-8"
                                    >
                                        <div className="text-center space-y-4">
                                            <div className="text-5xl">✨</div>
                                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic">Cria a tua Atividade</h2>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">O que vão fazer de especial nesta aventura?</p>
                                        </div>

                                        <input
                                            autoFocus
                                            value={customActivityName}
                                            onChange={(e) => setCustomActivityName(e.target.value)}
                                            placeholder="Ex: Jantar à luz das velas..."
                                            maxLength={50}
                                            className="w-full text-center text-sm p-4 rounded-2xl border-2 border-pink-100 focus:border-pink-400 outline-none text-gray-700 font-bold shadow-inner bg-gray-50/50"
                                        />

                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={() => {
                                                    toggleActivity({
                                                        id: 'custom',
                                                        emoji: '✨',
                                                        label: customActivityName || 'Atividade Personalizada',
                                                        clues: []
                                                    });
                                                    setShowCustomPopup(false);
                                                }}
                                                disabled={!customActivityName.trim()}
                                                className="w-full py-5 bg-pink-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-pink-200"
                                            >
                                                ADICIONAR ESTA ✨
                                            </button>
                                            <button
                                                onClick={() => setShowCustomPopup(false)}
                                                className="w-full py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                                            >
                                                CANCELAR
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                );

            case 'details':
                const currentOption = dateOptions[editingIndex] || dateOptions[0];
                const rangeLabel = `${MONTH_NAMES[today.getMonth()]} → ${MONTH_NAMES[end30.getMonth()]}`;

                return (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter leading-none">QUANDO E ONDE? 📍</h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">
                                Dá-lhe várias opções de dias e horários! Ela escolhe um.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-2xl space-y-6">
                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-gray-300 text-center uppercase tracking-widest">{rangeLabel}</p>
                                <div className="grid grid-cols-7 gap-1">
                                    {WEEKDAYS.map(w => <div key={w} className="text-[9px] font-black text-gray-300 text-center uppercase">{w}</div>)}
                                    {calendarDays.map((d, i) => {
                                        const dateStr = d.date.toISOString().split('T')[0];
                                        const isSelected = dateOptions.some(opt => opt.date === dateStr);
                                        const isEditing = currentOption?.date === dateStr;

                                        return (
                                            <button
                                                key={i}
                                                disabled={!d.inRange}
                                                onClick={() => toggleDate(dateStr)}
                                                className={`aspect-square rounded-xl text-xs font-black transition-all relative flex items-center justify-center
                          ${!d.inRange ? 'opacity-10 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                          ${isSelected ? 'bg-pink-500 text-white shadow-lg shadow-pink-100' : 'bg-gray-50 text-gray-400 hover:bg-pink-50 hover:text-pink-500'}
                          ${isEditing ? 'ring-2 ring-pink-500 ring-offset-2' : ''}
                        `}
                                            >
                                                {d.date.getDate()}
                                                {isSelected && <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm border border-pink-100"><Check size={8} className="text-pink-500" strokeWidth={4} /></div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Ajuste de Horário */}
                            <AnimatePresence mode="wait">
                                {currentOption && (
                                    <motion.div
                                        key={currentOption.date}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 bg-gradient-to-br from-pink-50 to-rose-50 rounded-[2rem] border border-pink-100/50 space-y-4"
                                    >
                                        <div className="flex justify-between items-center px-1">
                                            <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest">{currentOption.date}</p>
                                            <button
                                                onClick={() => dateOptions.length > 1 && toggleDate(currentOption.date)}
                                                className="text-[9px] font-black text-rose-400 hover:text-rose-600 uppercase transition-colors"
                                            >
                                                REMOVER
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-pink-100/50 relative">
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Hora</span>
                                            <button
                                                type="button"
                                                onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                                                className="text-2xl font-black text-gray-700 outline-none flex items-center gap-2 hover:text-pink-500 transition-colors"
                                            >
                                                {currentOption.time} <Clock size={20} className="text-pink-300" />
                                            </button>

                                            <TimePickerOverlay
                                                value={currentOption.time}
                                                onChange={(val) => { updateDateOption(editingIndex, { time: val }); setIsTimePickerOpen(false); }}
                                                isOpen={isTimePickerOpen}
                                                onClose={() => setIsTimePickerOpen(false)}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {dateOptions.length > 1 && (
                                <div className="flex justify-center gap-2">
                                    {dateOptions.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setEditingIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition-all ${editingIndex === idx ? 'w-6 bg-pink-500' : 'bg-gray-200 hover:bg-pink-300'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-[11px] font-black text-gray-800 uppercase tracking-tighter">LOCAL DO DATE (FORCA)</p>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-500 transition-transform group-focus-within:scale-110">
                                    <MapPin size={22} strokeWidth={3} />
                                </div>
                                <input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Ex: Local onde vai ser ex:Porto"
                                    maxLength={100}
                                    className="w-full bg-white pl-14 pr-6 py-5 rounded-[2rem] text-sm font-black text-gray-700 border-2 border-gray-100 focus:border-pink-500 outline-none shadow-xl transition-all uppercase tracking-widest placeholder:text-gray-200"
                                />
                            </div>
                            <p className="text-center text-[9px] text-gray-400 font-bold uppercase italic tracking-widest mt-2 animate-pulse">
                                O LOCAL SERÁ USADO NO JOGO DA FORCA! 🍿
                            </p>
                        </div>

                        <button
                            onClick={() => setStep('clues')}
                            disabled={!location.trim() || dateOptions.some(d => !d.date || !d.time)}
                            className="w-full py-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-[2rem] shadow-xl shadow-pink-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            CONTINUAR <ChevronRight size={20} strokeWidth={4} />
                        </button>
                    </div>
                );

            case 'clues':
                return (
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-black text-gray-800 uppercase tracking-tighter italic text-center leading-none">PISTAS<br />MISTERIOSAS 🔎</h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center px-4">Adiciona 3 pistas! Ela vai revelá-las uma a uma.</p>
                        </div>

                        <div className="space-y-4">
                            {clues.map((clue, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-2 group relative"
                                >
                                    <div className="flex-1 relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 font-black text-xs z-10">{idx + 1}</span>
                                        <input
                                            value={clue}
                                            onChange={(e) => {
                                                const newClues = [...clues];
                                                newClues[idx] = e.target.value;
                                                setClues(newClues);
                                            }}
                                            placeholder={`Pista ${idx + 1}...`}
                                            maxLength={100}
                                            className="w-full bg-white pl-10 pr-14 py-5 rounded-2xl text-xs font-bold text-gray-700 border-2 border-gray-50 focus:border-pink-300 outline-none shadow-sm transition-all"
                                        />
                                        <button
                                            onClick={() => removeClue(idx)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-rose-400 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            <button
                                onClick={() => addClue('')}
                                className="w-full py-4 border-2 border-dashed border-pink-200 text-pink-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-pink-50 transition-all"
                            >
                                + Adicionar Pista
                            </button>
                        </div>

                        <button
                            onClick={() => setStep('message')}
                            disabled={clues.length < 3 || clues.some(c => !c.trim())}
                            className="w-full py-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-[2rem] shadow-xl shadow-pink-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            CONTINUAR <ChevronRight size={20} strokeWidth={4} />
                        </button>
                    </div>
                );

            case 'message':
                return (
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-black text-gray-800 uppercase tracking-tighter italic">PARA QUEM? 💝</h1>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Deixa uma mensagem final.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest ml-4">Mensagem Final</span>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Ex: Mal posso esperar para te ver! 💕"
                                    rows={6}
                                    maxLength={1000}
                                    className="w-full bg-white px-8 py-8 rounded-[2.5rem] text-sm font-bold text-gray-700 border-2 border-gray-50 focus:border-pink-300 outline-none shadow-xl transition-all resize-none"
                                />
                                <p className="text-[9px] text-gray-400 font-black uppercase text-center italic px-4">Esta mensagem será revelada no final da experiência.</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!message.trim() || isSaving}
                            className="w-full py-7 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-[2.5rem] shadow-xl shadow-pink-200 disabled:opacity-30 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            {isSaving ? 'A Gerar Magia...' : 'GERAR SURPRESA ✨'}
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    if (createdId) {
        const shareUrl = `${window.location.origin}/surpresa/${createdId}`;
        return (
            <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_20%_20%,rgba(255,182,193,0.3)_0%,transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,105,180,0.2)_0%,transparent_40%)]">
                <div className="max-w-sm w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-white text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400" />
                    <div className="space-y-4">
                        <div className="text-6xl animate-bounce">🎁</div>
                        <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tighter italic leading-none">ESTÁ PRONTO!</h2>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic leading-tight px-4">Envia o link para ela e deixa a magia acontecer.</p>
                    </div>

                    <div className="p-6 bg-pink-50 rounded-[2.5rem] border-2 border-pink-100 break-all space-y-4">
                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest italic">Link Secreto:</p>
                        <p className="text-gray-600 font-mono text-[9px] font-bold bg-white p-3 rounded-xl shadow-inner border border-pink-50 truncate">{shareUrl}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                alert('Link copiado! 💝');
                            }}
                            className="w-full py-5 bg-gray-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-700 transition-all shadow-lg"
                        >
                            <Copy size={16} /> COPIAR LINK
                        </button>
                        <button
                            onClick={() => window.open(shareUrl, '_blank')}
                            className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-pink-200 hover:scale-[1.02] transition-all"
                        >
                            ABRIR SURPRESA 🔥
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF5F7] p-6 flex flex-col items-center bg-[radial-gradient(circle_at_20%_20%,rgba(255,182,193,0.3)_0%,transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,105,180,0.2)_0%,transparent_40%)]">
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => {
                            if (currentStep === 'activity') navigate('/');
                            else if (currentStep === 'details') setStep('activity');
                            else if (currentStep === 'clues') setStep('details');
                            else if (currentStep === 'message') setStep('clues'); // Fixed navigation
                        }}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-pink-500 shadow-sm border border-gray-50 transition-all active:scale-95"
                    >
                        <ArrowLeft size={24} strokeWidth={3} />
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] italic leading-none">Surprise</span>
                        <div className="flex gap-1.5 mt-2">
                            {['activity', 'details', 'clues', 'message'].map(s => (
                                <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === s ? 'w-8 bg-pink-500' : 'w-2 bg-pink-200 opacity-50'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="w-12" />
                </div>

                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="w-full"
                >
                    {renderStep()}
                </motion.div>
            </div>
        </div>
    );
}

// O bloco de document.createElement foi removido por segurança.
// O CSS correspondente deve ser adicionado ao index.css ou App.css.
