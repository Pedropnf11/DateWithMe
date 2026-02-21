
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { TEMPLATES } from '../data/templates';

const useQuizStore = create((set, get) => ({
    // Passo 1: Estado Inicial da Criação
    currentStep: 0,
    quizData: {
        templateId: null,
        title: '',
        questions: [], // Lista de perguntas
    },

    // Ações para o "Date Builder"
    setTemplate: (templateId) => {
        const template = TEMPLATES[templateId];
        if (template) {
            set({
                quizData: {
                    templateId,
                    title: template.label,
                    // Mapeia os passos para o formato interno editável
                    questions: (template.steps || template.questions).map(s => ({
                        ...s,
                        // Mantém todas as propriedades extra (gif, config, subtitle, options, type)
                    }))
                }
            });
        }
    },

    updateQuestion: (questionId, updates) => {
        set(state => ({
            quizData: {
                ...state.quizData,
                questions: state.quizData.questions.map(q =>
                    q.id === questionId ? { ...q, ...updates } : q
                )
            }
        }));
    },

    addGifToQuestion: (questionId, gifUrl) => {
        get().updateQuestion(questionId, { gif: gifUrl });
    },

    // Passo 2: Guardar na DB
    saveQuiz: async () => {
        const { quizData } = get();

        // Validação básica
        if (!quizData.questions.length) return { error: 'Adiciona pelo menos uma pergunta!' };

        // Limpar propriedades de UI (que começam com _) antes de guardar
        const cleanedSteps = quizData.questions.map(q => {
            const cleaned = { ...q };
            Object.keys(cleaned).forEach(key => {
                if (key.startsWith('_')) delete cleaned[key];
            });
            return cleaned;
        });

        // Usar RPC segura que devolve creator_key sem expor via SELECT público
        const { data, error } = await supabase
            .rpc('create_invite', {
                p_content: {
                    templateId: quizData.templateId,
                    title: quizData.title,
                    steps: cleanedSteps
                }
            });

        if (error) {
            if (import.meta.env.DEV) console.error('Supabase Error:', error);
            return { error: 'Ocorreu um erro técnico ao guardar. Tenta novamente.' };
        }

        const invite = Array.isArray(data) ? data[0] : data;

        // Guardar em localStorage para persistir entre sessões
        localStorage.setItem(`ck_${invite.id}`, invite.creator_key);

        // Retorna os links gerados
        // O link privado leva a chave como query param (?key=...) como fallback
        // — se o utilizador abrir noutro browser ou dispositivo, a chave está na URL
        return {
            success: true,
            publicLink: `/convite/${invite.id}`,
            privateLink: `/resultado/${invite.id}?key=${invite.creator_key}`
        };
    }
}));

export default useQuizStore;
