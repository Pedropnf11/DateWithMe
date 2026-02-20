import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

import { resolveActiveSteps } from '../components/Invite/utils';
import SuccessView from '../components/Invite/SuccessView';
import SummaryStep from '../components/Invite/Steps/SummaryStep';
import QuestionStep from '../components/Invite/Steps/QuestionStep';
import RankingStep from '../components/Invite/Steps/RankingStep';
import CalendarStep from '../components/Invite/Steps/CalendarStep';
import RatingStep from '../components/Invite/Steps/RatingStep';
import HappyGifStep from '../components/Invite/Steps/HappyGifStep';
import TextInputStep from '../components/Invite/Steps/TextInputStep';
import MessageStep from '../components/Invite/Steps/MessageStep';

export default function Invite() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invite, setInvite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [activeSteps, setActiveSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    // 'quiz' | 'summary' | 'success'
    const [phase, setPhase] = useState('quiz');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const templateId = invite?.content?.templateId ?? '';
    const isSpecial = templateId === 'special';

    useEffect(() => {
        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        async function fetchInvite() {
            if (!id || !UUID_REGEX.test(id)) {
                setLoading(false);
                setInvite(null);
                return;
            }

            const { data, error } = await supabase.rpc('get_safe_invite', { p_invite_id: id });

            if (!error && data && data.length > 0) {
                const inviteData = data[0];
                // Redirecionar surpresas para a rota correta
                if (inviteData.content?.templateId === 'surprise') {
                    navigate(`/surpresa/${inviteData.id}`, { replace: true });
                    return;
                }
                setInvite(inviteData);
                const initial = resolveActiveSteps(inviteData.content.steps, {});
                setActiveSteps(initial);
            }
            setLoading(false);
        }
        fetchInvite();
    }, [id]);

    const handleAnswer = (questionId, answer) => {
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        const allSteps = invite.content.steps;
        const newActive = resolveActiveSteps(allSteps, newAnswers);
        setActiveSteps(newActive);

        const nonSummarySteps = newActive.filter(s => s.type !== 'summary');
        const isLast = currentStep >= nonSummarySteps.length - 1;

        if (isLast) {
            // Quebra-Gelo → mostra SummaryStep antes de submeter
            // Especial → submete agora e vai para success
            if (isSpecial) {
                submitResponse(true);
                setPhase('success');
            } else {
                setPhase('summary');
            }
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const submitResponse = async (accepted) => {
        setIsSubmitting(true);
        if (accepted) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF69B4', '#FFD700', '#FF1493'],
            });
        }

        // Usar apenas a RPC segura 'submit_response'
        // A inserção direta na tabela 'responses' foi removida por segurança e para evitar duplicados
        await supabase.rpc('submit_response', {
            invite_uuid: id,
            p_decisao: accepted ? 'sim' : 'nao',
            p_answers: answers,
            p_mensagem: null,
        });

        setIsSubmitting(false);
        // Após confirmar, mostrar SuccessView (só para quebra-gelo que ficou no summary)
        if (phase === 'summary') {
            setPhase('success');
        }
    };

    // ── Loading ──────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-pink-500" size={48} />
        </div>
    );

    if (!invite) return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center text-center p-4">
            <div>
                <h1 className="text-4xl mb-4">💔</h1>
                <p className="text-gray-600 text-xl font-black uppercase tracking-tight">
                    Este convite não existe ou já expirou.
                </p>
            </div>
        </div>
    );

    // ── Phase: Summary (Quebra-Gelo) ─────────────────────────────
    if (phase === 'summary') {
        return (
            <div className="min-h-screen bg-pink-50 font-sans flex flex-col items-center justify-center p-6 pb-20">
                <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-pink-200/30 border border-white">
                    <SummaryStep
                        answers={answers}
                        onConfirm={() => submitResponse(true)}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        );
    }

    // ── Phase: Success ───────────────────────────────────────────
    if (phase === 'success') {
        const calendarStep = invite.content.steps.find(s => s.type === 'calendar');
        const creatorNote = calendarStep?.config?.creatorNote;
        return (
            <SuccessView
                onResponse={submitResponse}
                isSubmitting={isSubmitting}
                creatorNote={creatorNote}
                answers={answers}
                templateId={templateId}
            />
        );
    }

    // ── Phase: Quiz ──────────────────────────────────────────────
    const visibleSteps = activeSteps.filter(s => s.type !== 'summary' && s.type !== 'config');
    const step = visibleSteps[currentStep];
    if (!step) return null;

    const renderStep = () => {
        switch (step.type) {
            case 'question':
                return <QuestionStep step={step} onAnswer={handleAnswer} />;
            case 'happy_gif':
                return <HappyGifStep step={step} onAnswer={handleAnswer} />;
            case 'ranking':
                return <RankingStep step={step} onAnswer={handleAnswer} />;
            case 'calendar':
                return <CalendarStep step={step} onAnswer={handleAnswer} />;
            case 'rating':
                return <RatingStep step={step} onAnswer={handleAnswer} />;
            case 'text_input':
                return <TextInputStep step={step} onAnswer={handleAnswer} />;
            case 'message':
                return <MessageStep step={step} onAnswer={handleAnswer} />;
            default:
                return (
                    <div className="text-center">
                        <p className="text-gray-400 text-sm">Step desconhecido: {step.type}</p>
                        <button
                            onClick={() => handleAnswer(step.id, null)}
                            className="mt-4 px-6 py-3 bg-pink-500 text-white rounded-xl font-bold"
                        >
                            Continuar
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 font-sans flex flex-col items-center justify-center p-6 pb-20">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-100 z-50">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / visibleSteps.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-[0_0_10px_rgba(244,114,182,0.5)]"
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.05, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-pink-200/30 border border-white"
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-col items-center gap-2">
                <div className="px-4 py-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-pink-100 shadow-sm">
                    <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">
                        {currentStep + 1} / {visibleSteps.length} Passos
                    </span>
                </div>
                <div className="flex gap-1">
                    {visibleSteps.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentStep
                                ? 'bg-pink-500 w-4'
                                : i < currentStep
                                    ? 'bg-pink-300'
                                    : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
