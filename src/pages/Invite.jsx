
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Check, X, Loader2, PartyPopper, GripVertical, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

// ─── Drag-to-Rank Component ──────────────────────────────────────
function RankingPicker({ options, onConfirm }) {
    const [ranked, setRanked] = useState(
        options.filter(o => !o.excluded).map((opt, i) => ({ ...opt, _id: i }))
    );
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    const handleDragStart = (idx) => { dragItem.current = idx; };
    const handleDragEnter = (idx) => { dragOverItem.current = idx; };

    const handleDragEnd = () => {
        const from = dragItem.current;
        const to = dragOverItem.current;
        if (from === null || to === null || from === to) return;

        const newRanked = [...ranked];
        const [moved] = newRanked.splice(from, 1);
        newRanked.splice(to, 0, moved);
        setRanked(newRanked);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    return (
        <div className="space-y-4 w-full">
            <p className="text-sm font-bold text-gray-500 text-center">Drag to rank from your favourite to least favourite 👆</p>

            <div className="space-y-3">
                {ranked.map((opt, idx) => (
                    <div
                        key={opt._id}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragEnter={() => handleDragEnter(idx)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-3 cursor-grab active:cursor-grabbing active:shadow-lg active:border-pink-300 transition-all select-none"
                    >
                        {/* Rank number */}
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                            {idx + 1}
                        </div>

                        {/* Image */}
                        {opt.image && (
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                <img src={opt.image} className="w-full h-full object-cover" alt={opt.label} />
                            </div>
                        )}

                        {/* Label */}
                        <span className="flex-1 font-bold text-gray-700 text-base">{opt.label}</span>

                        {/* Drag handle */}
                        <GripVertical size={20} className="text-gray-300 shrink-0" />
                    </div>
                ))}
            </div>

            <button
                onClick={() => onConfirm(ranked.map(o => o.label))}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
                Confirm Ranking <ChevronRight size={20} />
            </button>
        </div>
    );
}

// ─── Calendar Picker (Recipient view) ────────────────────────────
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = ['JAN', 'FEV', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function CalendarPicker({ step, onConfirm }) {
    const [selected, setSelected] = useState(null);
    const offerFullCalendar = step.config?.offerFullCalendar;
    const availableDates = step.config?.selectedDates || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(today.getDate() + 30);

    // Build grid
    const startOfGrid = new Date(today);
    const dow = (today.getDay() + 6) % 7;
    startOfGrid.setDate(today.getDate() - dow);
    const endOfGrid = new Date(end);
    const edow = (end.getDay() + 6) % 7;
    endOfGrid.setDate(end.getDate() + (6 - edow));

    const days = [];
    const cur = new Date(startOfGrid);
    while (cur <= endOfGrid) {
        const ds = cur.toISOString().split('T')[0];
        days.push({
            date: new Date(cur),
            dateStr: ds,
            inRange: cur >= today && cur <= end,
            isAvailable: offerFullCalendar ? (cur >= today && cur <= end) : availableDates.includes(ds),
        });
        cur.setDate(cur.getDate() + 1);
    }

    const startMonth = MONTH_NAMES[today.getMonth()];
    const endMonth = MONTH_NAMES[end.getMonth()];
    const year = end.getFullYear();
    const rangeLabel = startMonth === endMonth ? `${startMonth}. ${year}` : `${startMonth}. → ${endMonth}. ${year}`;

    return (
        <div className="space-y-4 w-full">
            <p className="text-sm text-gray-500 font-medium text-center">Select a date that works for you:</p>
            <p className="text-xs text-gray-400 text-center">Next 30 days: {rangeLabel}</p>

            <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map(d => (
                    <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map(({ date, dateStr, inRange, isAvailable }) => {
                    const dayNum = date.getDate();
                    const isSelected = selected === dateStr;

                    if (!inRange) {
                        return <div key={dateStr} className="aspect-square flex items-center justify-center">
                            <span className="text-sm text-gray-200">{dayNum}</span>
                        </div>;
                    }

                    return (
                        <button
                            key={dateStr}
                            disabled={!isAvailable}
                            onClick={() => setSelected(dateStr)}
                            className={`aspect-square flex items-center justify-center rounded-full text-sm font-bold transition-all
                                ${isSelected
                                    ? 'bg-pink-500 text-white shadow-md shadow-pink-300'
                                    : isAvailable
                                        ? 'text-gray-700 hover:bg-pink-50 hover:text-pink-500'
                                        : 'text-gray-200 cursor-not-allowed'
                                }`}
                        >
                            {dayNum}
                        </button>
                    );
                })}
            </div>

            <button
                disabled={!selected}
                onClick={() => onConfirm(selected)}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            >
                Confirm Date <ChevronRight size={20} className="inline" />
            </button>
        </div>
    );
}

// ─── Rating Picker ────────────────────────────────────────────────
function RatingPicker({ step, onConfirm }) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const max = step.config?.maxStars || 5;

    return (
        <div className="space-y-6 text-center">
            <div className="flex justify-center gap-2">
                {Array.from({ length: max }, (_, i) => i + 1).map(i => (
                    <button
                        key={i}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(i)}
                        className="transition-transform hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                            fill={(hovered || rating) >= i ? '#FBBF24' : 'none'}
                            stroke={(hovered || rating) >= i ? '#FBBF24' : '#D1D5DB'}
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </button>
                ))}
            </div>

            {/* GIF below stars */}
            {step.gif && (
                <img src={step.gif} alt="Rating vibe" className="mx-auto h-48 rounded-2xl shadow-lg object-cover max-w-full" />
            )}

            {rating > 0 && (
                <p className="text-pink-500 font-bold text-lg">{rating} / {max} ⭐</p>
            )}
            <button
                disabled={!rating}
                onClick={() => onConfirm(rating)}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
                Submit Rating <ChevronRight size={20} className="inline" />
            </button>
        </div>
    );
}

// ─── Main Invite Component ────────────────────────────────────────
export default function Invite() {
    const { id } = useParams();
    const [invite, setInvite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchInvite() {
            const { data, error } = await supabase
                .from('invites')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Erro ao carregar convite:', error);
            } else {
                setInvite(data);
            }
            setLoading(false);
        }
        fetchInvite();
    }, [id]);

    const handleAnswer = (questionId, answer) => {
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        if (currentStep < invite.content.steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    const submitResponse = async (accepted) => {
        setIsSubmitting(true);

        if (accepted) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF69B4', '#FFD700', '#FF1493']
            });
        }

        const { error } = await supabase
            .from('responses')
            .insert([{
                invite_id: id,
                content: { accepted, answers }
            }]);

        if (error) {
            alert('Erro ao enviar resposta. Tenta novamente!');
            setIsSubmitting(false);
        } else {
            alert(accepted ? "YAY! Resposta enviada! 🎉" : "Resposta enviada. 😔");
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-pink-500" size={48} />
            </div>
        );
    }

    if (!invite) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center text-center p-4">
                <div>
                    <h1 className="text-4xl mb-4">💔</h1>
                    <p className="text-gray-600 text-xl font-bold">Oops! This invite doesn't exist or has expired.</p>
                </div>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center p-6 text-white font-sans">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-md p-8 rounded-[3rem] text-center max-w-md w-full border border-white/20 shadow-2xl"
                >
                    <PartyPopper size={64} className="mx-auto mb-6 text-yellow-300 animate-bounce" />
                    <h1 className="text-4xl font-black mb-4">All done!</h1>
                    <p className="text-xl mb-12 font-medium opacity-90">
                        Will you accept this special invitation?
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => submitResponse(false)}
                            disabled={isSubmitting}
                            className="px-8 py-4 bg-white/20 hover:bg-white/30 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <X size={18} /> No...
                        </button>
                        <button
                            onClick={() => submitResponse(true)}
                            disabled={isSubmitting}
                            className="px-8 py-4 bg-white text-pink-600 hover:scale-105 rounded-2xl font-black text-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Check strokeWidth={4} size={22} /> YES!
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const step = invite.content.steps[currentStep];

    const renderStep = () => {
        switch (step.type) {
            case 'question':
                return (
                    <div className="space-y-6 w-full text-center">
                        {step.gif && (
                            <img src={step.gif} alt="Vibe" className="w-full h-72 object-contain rounded-3xl shadow-lg" />
                        )}
                        <h2 className="text-3xl font-black text-gray-800 leading-tight">{step.title}</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAnswer(step.id, 'yes')}
                                className="flex-1 py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                YES! 💕
                            </button>
                            <button
                                onClick={() => handleAnswer(step.id, 'no')}
                                className="flex-1 py-5 bg-white border-2 border-gray-200 text-gray-500 font-bold rounded-2xl hover:border-gray-300 transition-all"
                            >
                                No...
                            </button>
                        </div>
                    </div>
                );

            case 'happy_gif':
                // Auto-advance: just show the gif and a continue button
                return (
                    <div className="space-y-6 w-full text-center">
                        {step.gif && (
                            <img src={step.gif} alt="Happy!" className="w-full h-64 object-cover rounded-3xl shadow-lg mx-auto" />
                        )}
                        <h2 className="text-2xl font-black text-pink-500">YAY! 🎉</h2>
                        <button
                            onClick={() => handleAnswer(step.id, 'seen')}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                        >
                            Continue <ChevronRight size={20} className="inline" />
                        </button>
                    </div>
                );

            case 'ranking':
                return (
                    <div className="space-y-4 w-full">
                        <h2 className="text-2xl font-black text-gray-800 text-center">{step.title}</h2>
                        <RankingPicker
                            options={step.options || []}
                            onConfirm={(ranked) => handleAnswer(step.id, ranked)}
                        />
                    </div>
                );

            case 'calendar':
                return (
                    <div className="space-y-4 w-full">
                        <h2 className="text-2xl font-black text-gray-800 text-center">{step.title}</h2>
                        <CalendarPicker
                            step={step}
                            onConfirm={(date) => handleAnswer(step.id, date)}
                        />
                    </div>
                );

            case 'rating':
                return (
                    <div className="space-y-4 w-full">
                        <h2 className="text-2xl font-black text-gray-800 text-center">{step.title}</h2>
                        <RatingPicker
                            step={step}
                            onConfirm={(rating) => handleAnswer(step.id, rating)}
                        />
                    </div>
                );

            default:
                return (
                    <div className="text-center">
                        <p className="text-gray-500">Unknown step type: {step.type}</p>
                        <button onClick={() => handleAnswer(step.id, null)} className="mt-4 px-6 py-3 bg-pink-500 text-white rounded-xl font-bold">
                            Next
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 font-sans flex flex-col items-center justify-center p-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-xl shadow-pink-200/40"
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>

            <div className="mt-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Step {currentStep + 1} of {invite.content.steps.length}
            </div>
        </div>
    );
}
