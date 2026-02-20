import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

import ScratchCalendar from '../components/Surprise/ScratchCalendar';
import WordGuess from '../components/Surprise/WordGuess';
import MysteryClues from '../components/Surprise/MysteryClues';
import FinalMessage from '../components/Surprise/FinalMessage';

export default function SurpriseInvite() {
    const { id } = useParams();
    const [invite, setInvite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0); // 0: Scratch, 1: Guess, 2: Clues, 3: Final
    const [selectedDate, setSelectedDate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                if (inviteData.status === 'expired') {
                    setInvite(null);
                } else {
                    setInvite(inviteData.content);
                }
            }
            setLoading(false);
        }
        fetchInvite();
    }, [id]);

    const handleNext = () => setStep(s => s + 1);

    const handleDateSelected = (opt) => {
        setSelectedDate(opt);
        handleNext();
    };

    const handleAccept = async () => {
        setIsSubmitting(true);
        await supabase.rpc('submit_response', {
            invite_uuid: id,
            p_decisao: 'sim',
            p_answers: {
                surprise_completed: true,
                chosen_date: selectedDate?.date,
                chosen_time: selectedDate?.time
            },
            p_mensagem: `Aceitou a aventura para o dia ${selectedDate?.date} às ${selectedDate?.time}! ✨`,
        });
        setIsSubmitting(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
            <Loader2 className="animate-spin text-pink-500" size={48} />
        </div>
    );

    if (!invite) return (
        <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white">
                <p className="text-4xl mb-4">💔</p>
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Convite não encontrado ou expirado.</p>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (step) {
            case 0:
                return <ScratchCalendar dateOptions={invite.dateOptions} onDone={handleDateSelected} />;
            case 1:
                return <WordGuess inviteId={id} onDone={handleNext} />;
            case 2:
                return <MysteryClues inviteId={id} onDone={handleNext} />;
            case 3:
                return (
                    <FinalMessage
                        message={invite.message}
                        herName={invite.herName}
                        onAccept={handleAccept}
                        isSubmitting={isSubmitting}
                        selectedDate={selectedDate}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF5F7] font-sans flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Container Background Decorativo */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-300 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-300 rounded-full blur-[120px]" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ y: 20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -20, opacity: 0, scale: 1.05 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 shadow-[0_20px_60px_rgba(255,182,193,0.3)] border border-white relative z-10"
                >
                    {renderCurrentStep()}
                </motion.div>
            </AnimatePresence>

            {/* Progress Indicator */}
            {step < 4 && ( // Hide progress indicator on the final step
                <div className="mt-8 flex gap-1.5 z-10">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-pink-500' :
                                i < step ? 'bg-pink-300' : 'bg-pink-100'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
