import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Check, X, Loader2, PartyPopper, GripVertical, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────────
// HELPER: resolve which steps are active based on answers so far
// Steps with showIf are only included if the referenced answer
// contains the required timeSlot value.
// ─────────────────────────────────────────────────────────────────
function resolveActiveSteps(allSteps, answers) {
    return allSteps.filter(step => {
        if (!step.showIf) return true; // always show steps without condition

        const { stepId, timeSlot } = step.showIf;
        const answer = answers[stepId]; // e.g. { date: '2026-03-15', timeSlot: 'morning' }
        if (!answer) return false;     // not answered yet — hide for now

        const chosen = answer.timeSlot ?? answer;
        return timeSlot.includes(chosen);
    });
}

// ─────────────────────────────────────────────────────────────────
// RankingPicker — drag-to-rank
// ─────────────────────────────────────────────────────────────────
function RankingPicker({ options, onConfirm }) {
    const [ranked, setRanked] = useState(
        options.map((opt, i) => ({ ...opt, _id: i }))
    );
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    const handleDragStart = (idx) => { dragItem.current = idx; };
    const handleDragEnter = (idx) => { dragOverItem.current = idx; };
    const handleDragEnd = () => {
        const from = dragItem.current;
        const to = dragOverItem.current;
        if (from === null || to === null || from === to) return;
        const next = [...ranked];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        setRanked(next);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    return (
        <div className="space-y-4 w-full">
            <p className="text-sm font-bold text-gray-500 text-center">
                Drag to rank from favourite to least favourite 👆
            </p>
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
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                            {idx + 1}
                        </div>
                        {opt.image && (
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                <img src={opt.image} className="w-full h-full object-cover" alt={opt.label} />
                            </div>
                        )}
                        <span className="flex-1 font-bold text-gray-700 text-base">{opt.label}</span>
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

// ─────────────────────────────────────────────────────────────────
// CalendarPicker — with optional time slots
// ─────────────────────────────────────────────────────────────────
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function CalendarPicker({ step, onConfirm }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const config = step.config || {};
    const availableDates = config.selectedDates || [];
    const offerFullCalendar = config.offerFullCalendar;
    const activeSlots = (config.timeSlots || []).filter(s => s.active);
    const hasSlots = activeSlots.length > 0;

    // Build 30-day calendar grid
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const end = new Date(today); end.setDate(today.getDate() + 30);
    const startOfGrid = new Date(today);
    startOfGrid.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const endOfGrid = new Date(end);
    endOfGrid.setDate(end.getDate() + (6 - ((end.getDay() + 6) % 7)));

    const days = [];
    const cur = new Date(startOfGrid);
    while (cur <= endOfGrid) {
        const ds = cur.toISOString().split('T')[0];
        days.push({
            date: new Date(cur), dateStr: ds,
            inRange: cur >= today && cur <= end,
            isAvailable: offerFullCalendar
                ? cur >= today && cur <= end
                : availableDates.includes(ds),
        });
        cur.setDate(cur.getDate() + 1);
    }

    const rangeLabel = (() => {
        const s = MONTH_NAMES[today.getMonth()];
        const e = MONTH_NAMES[end.getMonth()];
        return s === e ? `${s}. ${end.getFullYear()}` : `${s}. → ${e}. ${end.getFullYear()}`;
    })();

    const canConfirm = selectedDate && (!hasSlots || selectedSlot);

    const handleConfirm = () => {
        if (!canConfirm) return;
        onConfirm({
            date: selectedDate,
            timeSlot: selectedSlot ?? null,
        });
    };

    return (
        <div className="space-y-5 w-full">
            {/* Calendar */}
            <div>
                <p className="text-xs text-gray-400 text-center mb-3">
                    Next 30 days: {rangeLabel}
                </p>
                <div className="grid grid-cols-7 mb-1">
                    {WEEKDAYS.map(d => (
                        <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map(({ date, dateStr, inRange, isAvailable }) => {
                        if (!inRange) return (
                            <div key={dateStr} className="aspect-square flex items-center justify-center">
                                <span className="text-sm text-gray-200">{date.getDate()}</span>
                            </div>
                        );
                        const isSelected = selectedDate === dateStr;
                        return (
                            <button
                                key={dateStr}
                                disabled={!isAvailable}
                                onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}
                                className={`aspect-square flex items-center justify-center rounded-full text-sm font-bold transition-all
                                    ${isSelected
                                        ? 'bg-pink-500 text-white shadow-md shadow-pink-300'
                                        : isAvailable
                                            ? 'text-gray-700 hover:bg-pink-50 hover:text-pink-500'
                                            : 'text-gray-200 cursor-not-allowed'
                                    }`}
                            >
                                {date.getDate()}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time slot picker — only shown after a date is selected */}
            {hasSlots && selectedDate && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    <p className="text-sm font-bold text-gray-600 text-center">
                        What time works for you?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {activeSlots.map(slot => {
                            const isChosen = selectedSlot === slot.id;
                            return (
                                <button
                                    key={slot.id}
                                    onClick={() => setSelectedSlot(slot.id)}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all
                                        ${isChosen
                                            ? 'border-pink-500 bg-pink-50 shadow-md shadow-pink-200'
                                            : 'border-gray-100 bg-white hover:border-pink-200'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{slot.emoji}</div>
                                    <div className="font-black text-gray-800 text-sm">{slot.label}</div>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            <button
                disabled={!canConfirm}
                onClick={handleConfirm}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            >
                Confirm {selectedSlot ? `– ${activeSlots.find(s => s.id === selectedSlot)?.label}` : ''} <ChevronRight size={20} className="inline" />
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// RatingPicker
// ─────────────────────────────────────────────────────────────────
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
            {step.gif && (
                <img src={step.gif} alt="vibe" className="mx-auto h-48 rounded-2xl shadow-lg object-cover max-w-full" />
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

// ─────────────────────────────────────────────────────────────────
// QuestionStep — growing YES / NÃO unlocks after N clicks
// ─────────────────────────────────────────────────────────────────
function QuestionStep({ step, onAnswer }) {
    const [noClicks, setNoClicks] = useState(0);
    const [noPos, setNoPos] = useState({ x: null, y: null });
    const unlockAfter = step.config?.noUnlocksAfter ?? 0; // 0 = always unlocked
    const isNoLocked = unlockAfter > 0 && noClicks < unlockAfter;
    const yesScale = 1 + noClicks * 0.06;

    const noMessages = [
        "Are you sure? 🥺",
        "Think again...",
        "Really though? 😭",
        "Last chance...",
        `${unlockAfter - noClicks} more clicks to unlock...`,
        "Fine... 😔",
    ];
    const noMsg = noMessages[Math.min(noClicks, noMessages.length - 1)];

    const handleNo = () => {
        const newCount = noClicks + 1;
        setNoClicks(newCount);

        // Move button to random position
        setNoPos({
            x: Math.random() * 65 + 5,
            y: Math.random() * 65 + 5,
        });
    };

    const submitNo = () => {
        if (!isNoLocked) onAnswer(step.id, 'no');
    };

    return (
        <div className="space-y-6 w-full text-center">
            {step.gif && (
                <img src={step.gif} alt="Vibe" className="w-full h-72 object-contain rounded-3xl shadow-lg" />
            )}
            <h2 className="text-3xl font-black text-gray-800 leading-tight">{step.title}</h2>

            {/* YES */}
            <button
                onClick={() => onAnswer(step.id, 'yes')}
                style={{ transform: `scale(${Math.min(yesScale, 2.5)})` }}
                className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xl rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all origin-center"
            >
                SIMMMMM! 💕
            </button>

            {/* NO — floating when noClicks > 0 */}
            <button
                onClick={isNoLocked ? handleNo : submitNo}
                style={noClicks > 0 ? {
                    position: 'fixed',
                    left: `${noPos.x}%`,
                    top: `${noPos.y}%`,
                    zIndex: 50,
                    transition: 'all 0.15s',
                    opacity: isNoLocked ? 0.6 : 1,
                } : {}}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all
                    ${noClicks === 0
                        ? 'w-full bg-white border-2 border-gray-200 text-gray-500 hover:border-gray-300'
                        : 'bg-white border border-gray-200 text-gray-500 shadow-md'
                    }
                    ${isNoLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
            >
                {noClicks === 0 ? 'No...' : noMsg}
            </button>

            {noClicks > 0 && isNoLocked && (
                <p className="text-xs text-gray-400 mt-2">
                    (The No button is running away 😂)
                </p>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// MAIN — Invite page
// ─────────────────────────────────────────────────────────────────
export default function Invite() {
    const { id } = useParams();
    const [invite, setInvite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [activeSteps, setActiveSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchInvite() {
            const { data, error } = await supabase
                .from('invites')
                .select('id, content, status')
                .eq('id', id)
                .single();
            if (!error && data) {
                setInvite(data);
                // Initial active steps = all non-conditional steps
                const initial = resolveActiveSteps(data.content.steps, {});
                setActiveSteps(initial);
            }
            setLoading(false);
        }
        fetchInvite();
    }, [id]);

    const handleAnswer = (questionId, answer) => {
        const newAnswers = { ...answers, [questionId]: answer };
        setAnswers(newAnswers);

        // Re-resolve active steps with updated answers
        const allSteps = invite.content.steps;
        const newActive = resolveActiveSteps(allSteps, newAnswers);
        setActiveSteps(newActive);

        const nonSummarySteps = newActive.filter(s => s.type !== 'summary');
        const isLast = currentStep >= nonSummarySteps.length - 1;

        if (isLast) {
            setShowResult(true);
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const submitResponse = async (accepted) => {
        setIsSubmitting(true);
        if (accepted) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FF69B4', '#FFD700', '#FF1493'] });
        }
        const { error } = await supabase.rpc('submit_response', {
            invite_uuid: id,
            p_decisao: accepted ? 'sim' : 'nao',
            p_answers: answers,
            p_mensagem: null,
        });
        if (error) {
            alert('Erro ao enviar resposta. Tenta novamente!');
        }
        setIsSubmitting(false);
    };

    // ── Loading ────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-pink-500" size={48} />
        </div>
    );

    // ── Not found ──────────────────────────────────────────────
    if (!invite) return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center text-center p-4">
            <div>
                <h1 className="text-4xl mb-4">💔</h1>
                <p className="text-gray-600 text-xl font-bold">This invite doesn't exist or has expired.</p>
            </div>
        </div>
    );

    // ── Final result screen ────────────────────────────────────
    if (showResult) return (
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
                        <Check strokeWidth={4} size={22} /> YES! 🎉
                    </button>
                </div>
            </motion.div>
        </div>
    );

    // ── Active step render ─────────────────────────────────────
    const visibleSteps = activeSteps.filter(s => s.type !== 'summary');
    const step = visibleSteps[currentStep];
    if (!step) return null;

    const renderStep = () => {
        switch (step.type) {

            case 'question':
                return <QuestionStep step={step} onAnswer={handleAnswer} />;

            case 'happy_gif':
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
                        {step.subtitle && (
                            <p className="text-sm text-gray-400 text-center">{step.subtitle}</p>
                        )}
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
                            onConfirm={(val) => handleAnswer(step.id, val)}
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
                        <p className="text-gray-400 text-sm">Unknown step: {step.type}</p>
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
                    key={step.id}
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
                Step {currentStep + 1} of {visibleSteps.length}
            </div>
        </div>
    );
}