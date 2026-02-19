import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Check, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const WEEKDAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
const MONTH_NAMES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

import { toMinutes, resolveTimeContext } from '../utils';

export default function CalendarStep({ step, onAnswer }) {
    const config = step.config || {};
    const mode = config.mode || 'liberty'; // 'liberty' | 'suggestions'
    const suggestedDates = config.suggestedDates || []; // [{ date, start, end }]

    const [selectedDate, setSelectedDate] = useState(null);
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [showLibertyPopup, setShowLibertyPopup] = useState(mode === 'liberty');

    const libertyMessage = config.libertyMessage || 'Para ti tenho todo o tempo do mundo...';
    const libertyGif = config.libertyGif || 'https://media.tenor.com/CAtqFqK_2i0AAAAd/dance-girl.gif';

    // When a date is selected in suggestion mode, pre-fill its times
    useEffect(() => {
        if (mode === 'suggestions' && selectedDate) {
            const suggestion = suggestedDates.find(d => d.date === selectedDate);
            if (suggestion) {
                setCustomStart(suggestion.start);
                setCustomEnd(suggestion.end);
            }
        }
    }, [selectedDate, mode, suggestedDates]);

    const timeContext = resolveTimeContext(customStart, customEnd);

    // Build 30-day calendar grid
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const end30 = new Date(today); end30.setDate(today.getDate() + 30);
    const startOfGrid = new Date(today);
    startOfGrid.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const endOfGrid = new Date(end30);
    endOfGrid.setDate(end30.getDate() + (6 - ((end30.getDay() + 6) % 7)));

    const days = [];
    const cur = new Date(startOfGrid);
    while (cur <= endOfGrid) {
        const ds = cur.toISOString().split('T')[0];
        days.push({
            date: new Date(cur), dateStr: ds,
            inRange: cur >= today && cur <= end30,
            isAvailable: mode === 'liberty'
                ? (cur >= today && cur <= end30)
                : suggestedDates.some(sd => sd.date === ds),
        });
        cur.setDate(cur.getDate() + 1);
    }

    const rangeLabel = (() => {
        const s = MONTH_NAMES[today.getMonth()];
        const e = MONTH_NAMES[end30.getMonth()];
        return s === e
            ? `${s}. ${end30.getFullYear()}`
            : `${s}. → ${e}. ${end30.getFullYear()}`;
    })();

    const canConfirm = selectedDate && customStart && customEnd;

    const handleConfirm = () => {
        if (!canConfirm) return;
        onAnswer(step.id, {
            date: selectedDate,
            startTime: customStart,
            endTime: customEnd,
            timeRules: timeContext?.rules || {},
            badge: timeContext?.badge || '',
        });
    };

    return (
        <div className="space-y-4 w-full">
            <div className="text-center">
                <h2 className="text-2xl font-black text-gray-800">{step.title}</h2>
            </div>

            <div className="space-y-5">
                {/* ── Calendário ── */}
                <div>
                    <p className="text-[10px] text-gray-400 text-center mb-3 uppercase font-black tracking-widest">
                        {rangeLabel}
                    </p>
                    <div className="grid grid-cols-7 mb-1">
                        {WEEKDAYS.map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-gray-300 uppercase">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {days.map(({ date, dateStr, inRange, isAvailable }) => {
                            if (!inRange) return <div key={dateStr} className="aspect-square" />;

                            const isSelected = selectedDate === dateStr;
                            return (
                                <button
                                    key={dateStr}
                                    disabled={!isAvailable}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className={`aspect-square flex items-center justify-center rounded-xl text-sm font-black transition-all relative
                                        ${isSelected
                                            ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 scale-110'
                                            : isAvailable
                                                ? 'bg-gray-50 text-gray-700 hover:bg-pink-50 hover:text-pink-500 hover:scale-105'
                                                : 'text-gray-200 cursor-not-allowed opacity-20'
                                        }`}
                                >
                                    {date.getDate()}
                                    {isAvailable && !isSelected && mode === 'suggestions' && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Seleção de horário ── */}
                {selectedDate && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest">
                                {mode === 'suggestions' ? 'HORÁRIO SUGERIDO' : 'ESCOLHE O HORÁRIO'}
                            </p>

                            <div className="flex items-center justify-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Começa às</span>
                                    <input
                                        type="time"
                                        value={customStart}
                                        onChange={e => setCustomStart(e.target.value)}
                                        className="bg-transparent border-none text-2xl font-black text-gray-700 focus:outline-none cursor-pointer"
                                    />
                                </div>
                                <div className="w-px h-10 bg-gray-200" />
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Até às</span>
                                    <input
                                        type="time"
                                        value={customEnd}
                                        onChange={e => setCustomEnd(e.target.value)}
                                        className="bg-transparent border-none text-2xl font-black text-gray-700 focus:outline-none cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── VISUAL JOURNEY ── */}
                        <div className="relative pt-2 px-2">
                            <div className="flex items-center justify-between relative px-2">
                                <div className="absolute left-4 right-4 h-1 bg-gray-50 top-1/2 -translate-y-1/2 z-0" />
                                {[
                                    { id: 'hasLunch', emoji: '🍱', label: 'Almoço' },
                                    { id: 'hasSnack', emoji: '☕', label: 'Lanche' },
                                    { id: 'hasActivity', emoji: '🎳', label: 'Atividade' },
                                    { id: 'hasDinner', emoji: '🍷', label: 'Jantar' },
                                    { id: 'hasNightOut', emoji: '🌙', label: 'Noite' }
                                ].map((s, idx) => {
                                    const isActive = s.always || (timeContext?.rules?.[s.id]);
                                    return (
                                        <div key={idx} className="relative z-10 flex flex-col items-center transition-all duration-500" style={{ opacity: isActive ? 1 : 0.1, transform: isActive ? 'scale(1)' : 'scale(0.8)' }}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border ${isActive ? 'bg-white border-pink-500 text-pink-500' : 'bg-white border-gray-100'}`}>
                                                {s.emoji}
                                            </div>
                                            <span className="text-[8px] font-black mt-2 text-gray-400 uppercase tracking-tighter">{s.label}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {timeContext && (
                                <motion.div key={timeContext.badge} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mt-6">
                                    <span className="px-4 py-1.5 bg-pink-50 text-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-100 italic">
                                        "{timeContext.badge}"
                                    </span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                <button
                    disabled={!canConfirm}
                    onClick={handleConfirm}
                    className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-[2rem] shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 mt-4 flex items-center justify-center gap-2"
                >
                    CONFIRMAR DATA <ChevronRight size={22} strokeWidth={3} />
                </button>
            </div>
            <AnimatePresence>
                {showLibertyPopup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-pink-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-rose-400" />
                            <button
                                onClick={() => setShowLibertyPopup(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                            >
                                <X size={20} strokeWidth={3} />
                            </button>

                            <img
                                src={libertyGif}
                                alt="Happy Dance"
                                className="w-48 h-48 mx-auto rounded-3xl object-cover mb-6 shadow-lg shadow-pink-100 ring-4 ring-pink-50"
                            />

                            <h3 className="text-2xl font-black text-gray-800 leading-tight mb-2">
                                ✨ SURPRESA! ✨
                            </h3>

                            <p className="text-lg font-bold text-pink-500 italic leading-relaxed px-2">
                                "{libertyMessage}"
                            </p>

                            <button
                                onClick={() => setShowLibertyPopup(false)}
                                className="mt-8 w-full py-4 bg-pink-500 text-white font-black rounded-2xl shadow-lg hover:bg-pink-600 transition-all uppercase tracking-widest text-xs"
                            >
                                WOW! OBRIGADA 😍
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
