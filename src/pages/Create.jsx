
import { useEffect, useState, useRef } from 'react';
import useQuizStore from '../store/useQuizStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ArrowLeft, X, Plus, Trash2, Copy,
    Link2, Upload, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Calendar helpers ────────────────────────────────────────────
function buildCalendarDays(referenceDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(today.getDate() + 30);

    // Find Monday of the week that contains `today`
    const startOfGrid = new Date(today);
    const dayOfWeek = (today.getDay() + 6) % 7; // Mon=0
    startOfGrid.setDate(today.getDate() - dayOfWeek);

    // Find Sunday of the week that contains `end`
    const endOfGrid = new Date(end);
    const endDayOfWeek = (end.getDay() + 6) % 7;
    endOfGrid.setDate(end.getDate() + (6 - endDayOfWeek));

    const days = [];
    const cur = new Date(startOfGrid);
    while (cur <= endOfGrid) {
        days.push({
            date: new Date(cur),
            inRange: cur >= today && cur <= end,
            isToday: cur.getTime() === today.getTime(),
        });
        cur.setDate(cur.getDate() + 1);
    }
    return days;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = ['JAN', 'FEV', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// ─── Calendar Step Component ─────────────────────────────────────
function CalendarStep({ step, updateQuestion }) {
    const calendarDays = buildCalendarDays();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(today.getDate() + 30);

    const selectedDates = step.config?.selectedDates || [];
    const selectedTimes = step.config?.selectedTimes || {}; // { "2026-02-20": { from: "18:00", to: "22:00" } }
    const offerFullCalendar = step.config?.offerFullCalendar || false;
    const fullCalendarTime = step.config?.fullCalendarTime || { from: '18:00', to: '23:00' };

    const toggleDate = (dateStr) => {
        const current = step.config?.selectedDates || [];
        const currentTimes = step.config?.selectedTimes || {};
        let newDates, newTimes;
        if (current.includes(dateStr)) {
            newDates = current.filter(d => d !== dateStr);
            newTimes = { ...currentTimes };
            delete newTimes[dateStr];
        } else {
            newDates = [...current, dateStr];
            newTimes = { ...currentTimes, [dateStr]: { from: '18:00', to: '23:00' } };
        }
        updateQuestion(step.id, { config: { ...step.config, selectedDates: newDates, selectedTimes: newTimes } });
    };

    const updateTimeForDate = (dateStr, field, value) => {
        const currentTimes = step.config?.selectedTimes || {};
        const newTimes = {
            ...currentTimes,
            [dateStr]: { ...currentTimes[dateStr], [field]: value }
        };
        updateQuestion(step.id, { config: { ...step.config, selectedTimes: newTimes } });
    };

    const updateFullCalendarTime = (field, value) => {
        updateQuestion(step.id, {
            config: { ...step.config, fullCalendarTime: { ...fullCalendarTime, [field]: value } }
        });
    };

    const toggleFullCalendar = () => {
        updateQuestion(step.id, {
            config: { ...step.config, offerFullCalendar: !offerFullCalendar }
        });
    };

    // Generate time options (every 30 min)
    const timeOptions = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            timeOptions.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
    }

    // Get month range label
    const startMonth = MONTH_NAMES[today.getMonth()];
    const endMonth = MONTH_NAMES[end.getMonth()];
    const year = end.getFullYear();
    const rangeLabel = startMonth === endMonth
        ? `${startMonth}. ${year}`
        : `${startMonth}. → ${endMonth}. ${year}`;

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-black text-pink-500 uppercase tracking-wide text-center">
                {step.stepLabel}
            </h2>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={toggleFullCalendar}
                    className={`w-12 h-6 rounded-full relative transition-colors ${offerFullCalendar ? 'bg-pink-500' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${offerFullCalendar ? 'translate-x-6' : ''}`} />
                </button>
                <span className="text-xs font-black uppercase tracking-widest text-gray-600">Offer Full Calendar</span>
            </div>

            {!offerFullCalendar && (
                <>
                    <p className="text-center text-sm text-gray-500 font-medium">Select available dates & times:</p>
                    <p className="text-center text-xs text-gray-400">Next 30 days: {rangeLabel}</p>

                    {/* Calendar Grid */}
                    <div className="w-full">
                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 mb-2">
                            {WEEKDAYS.map(d => (
                                <div key={d} className="text-center text-xs font-bold text-gray-500 py-1">{d}</div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map(({ date, inRange, isToday }) => {
                                const dateStr = date.toISOString().split('T')[0];
                                const isSelected = selectedDates.includes(dateStr);
                                const dayNum = date.getDate();

                                if (!inRange) {
                                    return (
                                        <div key={dateStr} className="aspect-square flex items-center justify-center">
                                            <span className="text-sm text-gray-200">{dayNum}</span>
                                        </div>
                                    );
                                }

                                return (
                                    <button
                                        key={dateStr}
                                        onClick={() => toggleDate(dateStr)}
                                        className={`aspect-square flex items-center justify-center rounded-full text-sm font-bold transition-all
                                            ${isSelected
                                                ? 'bg-pink-500 text-white shadow-md shadow-pink-300'
                                                : isToday
                                                    ? 'border-2 border-pink-300 text-pink-500 hover:bg-pink-50'
                                                    : 'text-gray-700 hover:bg-pink-50 hover:text-pink-500'
                                            }`}
                                    >
                                        {dayNum}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time pickers for selected dates */}
                    {selectedDates.length > 0 && (
                        <div className="space-y-3 border-t border-gray-100 pt-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Available hours per day</p>
                            {selectedDates.sort().map(dateStr => {
                                const dateObj = new Date(dateStr + 'T00:00:00');
                                const dayLabel = dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
                                const times = selectedTimes[dateStr] || { from: '18:00', to: '23:00' };
                                return (
                                    <div key={dateStr} className="flex items-center gap-2 bg-pink-50 rounded-xl p-3">
                                        <span className="text-xs font-bold text-pink-600 w-20 shrink-0">{dayLabel}</span>
                                        <select
                                            value={times.from}
                                            onChange={(e) => updateTimeForDate(dateStr, 'from', e.target.value)}
                                            className="flex-1 text-xs font-bold p-2 rounded-lg border border-pink-200 bg-white text-gray-700 outline-none focus:border-pink-500"
                                        >
                                            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <span className="text-xs text-gray-400 font-bold">→</span>
                                        <select
                                            value={times.to}
                                            onChange={(e) => updateTimeForDate(dateStr, 'to', e.target.value)}
                                            className="flex-1 text-xs font-bold p-2 rounded-lg border border-pink-200 bg-white text-gray-700 outline-none focus:border-pink-500"
                                        >
                                            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {offerFullCalendar && (
                <div className="bg-pink-50 rounded-2xl p-6 text-center border border-pink-100 space-y-4">
                    <p className="text-pink-600 font-black text-lg">Para ti arranjo sempre tempo 💕</p>
                    <img
                        src="https://media1.tenor.com/m/afjI9QKGDTUAAAAC/blinking-wink.gif"
                        alt="Wink"
                        className="mx-auto h-40 rounded-2xl shadow-lg object-cover"
                    />
                    <div className="space-y-2 pt-2">
                        <p className="text-xs font-bold text-gray-500 uppercase">Default time range for any day</p>
                        <div className="flex items-center gap-2 justify-center">
                            <select
                                value={fullCalendarTime.from}
                                onChange={(e) => updateFullCalendarTime('from', e.target.value)}
                                className="text-sm font-bold p-2 rounded-lg border border-pink-200 bg-white text-gray-700 outline-none focus:border-pink-500"
                            >
                                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <span className="text-sm text-gray-400 font-bold">→</span>
                            <select
                                value={fullCalendarTime.to}
                                onChange={(e) => updateFullCalendarTime('to', e.target.value)}
                                className="text-sm font-bold p-2 rounded-lg border border-pink-200 bg-white text-gray-700 outline-none focus:border-pink-500"
                            >
                                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Happy GIF Step Component ────────────────────────────────────
function HappyGifStep({ step, updateQuestion }) {
    const [mode, setMode] = useState(step.gif ? 'url' : null);
    const fileInputRef = useRef(null);

    const handleUrlChange = (e) => {
        updateQuestion(step.id, { gif: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            updateQuestion(step.id, { gif: ev.target.result });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6 text-center">
            <h2 className="text-2xl font-black text-pink-500 uppercase tracking-wide">
                {step.stepLabel}
            </h2>

            {!mode && (
                <div className="flex gap-4 justify-center">
                    {/* USE URL */}
                    <button
                        onClick={() => setMode('url')}
                        className="flex flex-col items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl p-6 w-36 hover:border-pink-400 hover:bg-pink-50 transition-all shadow-sm"
                    >
                        <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center">
                            <Link2 size={28} className="text-pink-500" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-600">Use URL</span>
                    </button>

                    {/* UPLOAD FILE */}
                    <button
                        onClick={() => { setMode('upload'); fileInputRef.current?.click(); }}
                        className="flex flex-col items-center gap-3 bg-white border-2 border-gray-100 rounded-2xl p-6 w-36 hover:border-pink-400 hover:bg-pink-50 transition-all shadow-sm"
                    >
                        <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center">
                            <Upload size={28} className="text-pink-500" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-600">Upload File</span>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*,image/gif" className="hidden" onChange={handleFileChange} />
                </div>
            )}

            {mode === 'url' && (
                <div className="space-y-3">
                    <input
                        autoFocus
                        value={step.gif || ''}
                        onChange={handleUrlChange}
                        placeholder="Paste GIF / image URL here..."
                        className="w-full text-center text-sm p-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none"
                    />
                    <button onClick={() => { setMode(null); updateQuestion(step.id, { gif: null }); }} className="text-xs text-gray-400 hover:text-red-400">
                        ← Back
                    </button>
                </div>
            )}

            {mode === 'upload' && !step.gif && (
                <div className="space-y-3">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-pink-300 rounded-2xl p-10 cursor-pointer hover:bg-pink-50 transition-colors"
                    >
                        <Upload size={36} className="mx-auto text-pink-400 mb-2" />
                        <p className="text-sm text-pink-400 font-bold">Click to choose a file</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*,image/gif" className="hidden" onChange={handleFileChange} />
                    <button onClick={() => setMode(null)} className="text-xs text-gray-400 hover:text-red-400">← Back</button>
                </div>
            )}

            {step.gif && (
                <div className="relative inline-block">
                    <img src={step.gif} className="mx-auto h-48 rounded-2xl shadow-lg object-cover max-w-full" alt="Happy GIF preview" />
                    <button
                        onClick={() => { updateQuestion(step.id, { gif: null }); setMode(null); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-600"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Ranking Step Component (Creator view) ───────────────────────
function RankingStep({ step, updateQuestion }) {
    const fileInputRef = useRef(null);
    const [customName, setCustomName] = useState('');
    const [customImagePreview, setCustomImagePreview] = useState(null);
    const [customImageData, setCustomImageData] = useState(null);

    const options = step.options || [];

    const toggleOption = (idx) => {
        const newOpts = options.map((opt, i) =>
            i === idx ? { ...opt, excluded: !opt.excluded } : opt
        );
        updateQuestion(step.id, { options: newOpts });
    };

    const removeOption = (idx) => {
        const newOpts = options.filter((_, i) => i !== idx);
        updateQuestion(step.id, { options: newOpts });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setCustomImagePreview(ev.target.result);
            setCustomImageData(ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    const addCustomOption = () => {
        if (!customName.trim()) return;
        const newOpt = { label: customName.trim(), image: customImageData || '' };
        updateQuestion(step.id, { options: [...options, newOpt] });
        setCustomName('');
        setCustomImagePreview(null);
        setCustomImageData(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-5">
            {/* Title */}
            <input
                value={step.title}
                onChange={(e) => updateQuestion(step.id, { title: e.target.value })}
                className="w-full text-center text-2xl font-black text-gray-800 bg-transparent outline-none placeholder-gray-300 pb-2 border-b-2 border-gray-100 focus:border-pink-400"
            />

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                You pick the options → they drag to rank
            </p>

            {/* Image Card Grid */}
            <div className="grid grid-cols-3 gap-3">
                {options.map((opt, idx) => {
                    const label = typeof opt === 'object' ? opt.label : opt;
                    const image = typeof opt === 'object' ? opt.image : '';
                    const excluded = typeof opt === 'object' ? !!opt.excluded : false;

                    return (
                        <div
                            key={idx}
                            onClick={() => toggleOption(idx)}
                            className="relative cursor-pointer rounded-2xl overflow-hidden transition-all group"
                            style={{ border: excluded ? '2px solid #e5e7eb' : '3px solid #f472b6', opacity: excluded ? 0.45 : 1, filter: excluded ? 'grayscale(1)' : 'none' }}
                        >
                            {/* Image */}
                            <div className="aspect-square bg-gray-100">
                                {image
                                    ? <img src={image} className="w-full h-full object-cover" alt={label} />
                                    : <div className="w-full h-full flex items-center justify-center text-3xl bg-pink-50">{label.match(/\p{Emoji}/u)?.[0] || '🍽️'}</div>
                                }
                            </div>

                            {/* Label */}
                            <div className="bg-white px-1 py-1.5 text-center">
                                <span className="text-xs font-bold text-gray-700 truncate block">{label}</span>
                            </div>

                            {/* Checkmark overlay */}
                            {!excluded && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center shadow">
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}

                            {/* Remove button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); removeOption(idx); }}
                                className="absolute top-1.5 left-1.5 w-5 h-5 bg-red-500 rounded-full items-center justify-center shadow hidden group-hover:flex"
                            >
                                <X size={10} className="text-white" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Add your own section */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-xs font-bold text-gray-500 text-center">Or add your own:</p>
                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    Tip: Add a name and optionally upload an image, then click <strong>"Add Option"</strong> to confirm.
                </p>

                <input
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Tacos 🌮"
                    className="w-full text-sm p-3 rounded-xl border-2 border-gray-100 focus:border-pink-400 outline-none text-gray-700 font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && addCustomOption()}
                />

                <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 text-center">1. Upload image file (optional)<br />2. Click "Add Option" to confirm</p>

                    {customImagePreview && (
                        <div className="relative w-20 h-20 mx-auto rounded-xl overflow-hidden border-2 border-pink-300">
                            <img src={customImagePreview} className="w-full h-full object-cover" alt="preview" />
                            <button
                                onClick={() => { setCustomImagePreview(null); setCustomImageData(null); }}
                                className="absolute top-0.5 right-0.5 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center"
                            >
                                <X size={8} className="text-white" />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 bg-pink-50 border-2 border-pink-200 text-pink-600 font-bold text-sm rounded-xl hover:bg-pink-100 transition-all flex items-center justify-center gap-2"
                    >
                        <Upload size={16} /> Step 1: Upload Image File
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                    <p className="text-[9px] text-gray-400 text-center">
                        Note: iPhone photos are often HEIC/HEIF. Please convert/export as JPG or PNG.
                    </p>
                </div>

                <button
                    onClick={addCustomOption}
                    disabled={!customName.trim()}
                    className="w-full py-3 bg-pink-500 text-white font-black rounded-xl hover:bg-pink-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> Step 2: Add Custom Option
                </button>
                <p className="text-[10px] text-gray-400 text-center">This confirms your name + image and adds it to the grid above.</p>
            </div>
        </div>
    );
}

// ─── Main Create Component ───────────────────────────────────────
export default function Create() {
    const { quizData, updateQuestion, saveQuiz } = useQuizStore();
    const navigate = useNavigate();

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [createdLinks, setCreatedLinks] = useState(null);

    useEffect(() => {
        if (!quizData.templateId) navigate('/');
    }, [quizData.templateId, navigate]);

    if (!quizData.questions || quizData.questions.length === 0) return null;

    const currentStep = quizData.questions[currentStepIndex];
    const isLastStep = currentStepIndex === quizData.questions.length - 1;

    const handleNext = () => {
        if (currentStepIndex < quizData.questions.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        } else {
            navigate('/');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await saveQuiz();
        setIsSaving(false);
        if (result.success) {
            setCreatedLinks(result);
        } else {
            alert('Erro: ' + result.error);
        }
    };

    const setNoButtonBehavior = (behavior) => {
        const currentConfig = currentStep.config || {};
        let newBehavior = behavior;
        if (currentConfig.noButtonBehavior === behavior) newBehavior = 'none';
        updateQuestion(currentStep.id, {
            config: { ...currentConfig, noButtonBehavior: newBehavior }
        });
    };

    // ─── Step Renderers ──────────────────────────────────────────

    const renderStepContent = () => {
        switch (currentStep.type) {

            case 'question':
                return (
                    <div className="space-y-6 text-center">
                        {/* Step Label */}
                        <h2 className="text-2xl font-black text-pink-500 uppercase tracking-wide">
                            {currentStep.stepLabel}
                        </h2>

                        {/* Editable Question Title */}
                        <input
                            value={currentStep.title}
                            onChange={(e) => updateQuestion(currentStep.id, { title: e.target.value })}
                            className="w-full text-center text-3xl font-black text-gray-800 bg-transparent border-b-2 border-gray-200 focus:border-pink-500 focus:outline-none pb-2 placeholder-gray-300"
                            placeholder="Type your question..."
                        />

                        {/* GIF visible below the question */}
                        {currentStep.gif && (
                            <div className="relative inline-block">
                                <img src={currentStep.gif} className="mx-auto h-48 rounded-2xl shadow-lg object-cover max-w-full" alt="Question GIF" />
                                <button
                                    onClick={() => updateQuestion(currentStep.id, { gif: null })}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {/* If no GIF, show URL input to add one */}
                        {!currentStep.gif && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase block mb-2">Image / GIF (Optional)</span>
                                <input
                                    value={''}
                                    onChange={(e) => updateQuestion(currentStep.id, { gif: e.target.value })}
                                    placeholder="Paste GIF / image URL..."
                                    className="w-full text-sm p-2 rounded-lg border border-gray-200 focus:border-pink-400 outline-none text-center"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'happy_gif':
                return (
                    <HappyGifStep step={currentStep} updateQuestion={updateQuestion} />
                );

            case 'ranking':
                return (
                    <RankingStep step={currentStep} updateQuestion={updateQuestion} />
                );

            case 'calendar':
                return (
                    <CalendarStep step={currentStep} updateQuestion={updateQuestion} />
                );

            case 'rating':
                return (
                    <div className="text-center space-y-5">
                        <input
                            value={currentStep.title}
                            onChange={(e) => updateQuestion(currentStep.id, { title: e.target.value })}
                            className="w-full text-center text-2xl font-black text-gray-800 bg-transparent outline-none border-b-2 border-gray-100 focus:border-pink-400 pb-2"
                        />
                        <div className="flex justify-center gap-2 text-yellow-400">
                            {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={true} />)}
                        </div>

                        {/* GIF below stars */}
                        {currentStep.gif && (
                            <div className="relative inline-block">
                                <img src={currentStep.gif} className="mx-auto h-48 rounded-2xl shadow-lg object-cover max-w-full" alt="Rating GIF" />
                                <button
                                    onClick={() => updateQuestion(currentStep.id, { gif: null })}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {!currentStep.gif && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase block mb-2">GIF Below Stars (Optional)</span>
                                <input
                                    value={''}
                                    onChange={(e) => updateQuestion(currentStep.id, { gif: e.target.value })}
                                    placeholder="Paste GIF / image URL..."
                                    className="w-full text-sm p-2 rounded-lg border border-gray-200 focus:border-pink-400 outline-none text-center"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'summary':
                return (
                    <div className="text-center space-y-6">
                        <h2 className="text-3xl font-black text-gray-800">READY TO SEND?</h2>

                        <div className="bg-white p-6 rounded-2xl shadow-lg text-left space-y-4 border border-gray-100">
                            <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4 border-b border-pink-100 pb-2">YOUR DATE PLAN</h3>
                            {quizData.questions.filter(q => q.type !== 'summary').map((q, i) => (
                                <div key={q.id} className="flex gap-4 items-start">
                                    <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xs shrink-0 mt-1">{i + 1}</div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{q.title}</p>
                                        <p className="text-xs text-gray-400">{q.type === 'question' ? 'The Big Question' : q.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-black text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {isSaving ? 'CREATING...' : 'SAVE & SEND 💌'}
                        </button>
                    </div>
                );

            default:
                return <div>Unknown step type: {currentStep.type}</div>;
        }
    };

    return (
        <div className="min-h-screen bg-pink-50/30 flex flex-col font-sans text-gray-900 pb-20">
            {/* Header */}
            <header className="px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-20">
                <button onClick={handlePrev} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </button>
                <div className="font-bold text-pink-500 uppercase tracking-wider text-xs">
                    Step {currentStepIndex + 1} of {quizData.questions.length}
                </div>
                <div className="w-10" />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-lg mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full bg-white rounded-[2.5rem] p-8 shadow-xl shadow-pink-200/40 border border-white"
                    >
                        {renderStepContent()}

                        {currentStep.type !== 'summary' && (
                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                                <button onClick={handlePrev} className="text-gray-400 font-bold text-sm hover:text-gray-600">Back</button>
                                <button
                                    onClick={handleNext}
                                    className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-600 hover:shadow-pink-500/30 transition-all flex items-center gap-2"
                                >
                                    Next Step <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Success Modal */}
            <AnimatePresence>
                {createdLinks && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/80 backdrop-blur-md">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-6">
                            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl mb-4">🎉</div>
                            <h2 className="text-3xl font-black text-gray-800">IT'S LIVE!</h2>
                            <p className="text-gray-500">Your date invitation is ready.</p>

                            {/* Link for the girl */}
                            <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 text-left space-y-2">
                                <p className="text-xs font-bold text-pink-500 uppercase">💌 Link para ela (envia este link)</p>
                                <div className="flex gap-2">
                                    <input readOnly value={window.location.origin + createdLinks.publicLink} className="flex-1 bg-white border border-pink-300 rounded-lg p-2 text-sm text-gray-600 font-mono" />
                                    <button onClick={() => navigator.clipboard.writeText(window.location.origin + createdLinks.publicLink)} className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition-colors">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Link for the creator */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase">👀 Link para ti (ver respostas)</p>
                                <div className="flex gap-2">
                                    <input readOnly value={window.location.origin + createdLinks.privateLink} className="flex-1 bg-white border border-gray-300 rounded-lg p-2 text-sm text-gray-600 font-mono" />
                                    <button onClick={() => navigator.clipboard.writeText(window.location.origin + createdLinks.privateLink)} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-black transition-colors">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            <button onClick={() => window.location.href = createdLinks.privateLink} className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
                                Go to Dashboard →
                            </button>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Star Icon ───────────────────────────────────────────────────
function StarIcon({ filled }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
