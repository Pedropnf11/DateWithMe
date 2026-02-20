
import { useEffect, useState, useRef } from 'react';
import useQuizStore from '../store/useQuizStore';
import { resolveTimeContext, resolveActiveSteps } from '../components/Invite/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ArrowLeft, X, Plus, Trash2, Copy,
    Link2, Upload, ChevronLeft, ChevronRight as ChevronRightIcon,
    Check, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildCalendarDays, WEEKDAYS, MONTH_NAMES } from '../utils/calendarUtils';

// Calendar helpers previously here are now in utils/calendarUtils.js

// ─── Calendar Step Component ─────────────────────────────────────
function CalendarStep({ step, updateQuestion }) {
    const calendarDays = buildCalendarDays();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(today.getDate() + 30);

    const [editingDate, setEditingDate] = useState(null);
    const [hh, setHh] = useState('19');
    const [mm, setMm] = useState('00');
    const [hhe, setHhe] = useState('22');
    const [mme, setMme] = useState('00');

    const config = step.config || {};
    const mode = config.mode || 'liberty'; // 'liberty' (Mode 1) | 'suggestions' (Mode 2)
    const suggestedDates = config.suggestedDates || []; // [{ date, start, end }]
    const calendarMessage = config.calendarMessage || 'Para ti arranjo sempre tempo 💕';

    const setMode = (newMode) => {
        updateQuestion(step.id, { config: { ...config, mode: newMode } });
    };

    const toggleDate = (dateStr) => {
        if (mode === 'liberty') return;
        const exists = suggestedDates.find(d => d.date === dateStr);
        if (exists) {
            setEditingDate(dateStr);
            setHh(exists.start?.split(':')[0] || '19');
            setMm(exists.start?.split(':')[1] || '00');
            setHhe(exists.end?.split(':')[0] || '22');
            setMme(exists.end?.split(':')[1] || '00');
        } else {
            const newDates = [...suggestedDates, { date: dateStr, start: '19:00', end: '22:00' }];
            updateQuestion(step.id, { config: { ...config, suggestedDates: newDates } });
            setEditingDate(dateStr);
            setHh('19'); setMm('00'); setHhe('22'); setMme('00');
        }
    };

    const removeDate = (dateStr) => {
        const newDates = suggestedDates.filter(d => d.date !== dateStr);
        updateQuestion(step.id, { config: { ...config, suggestedDates: newDates } });
        if (editingDate === dateStr) setEditingDate(null);
    };

    const updateTime = () => {
        if (!editingDate) return;
        const newDates = suggestedDates.map(d => {
            if (d.date === editingDate) {
                return { ...d, start: `${hh}:${mm}`, end: `${hhe}:${mme}` };
            }
            return d;
        });
        updateQuestion(step.id, { config: { ...config, suggestedDates: newDates } });
    };

    const [showFreePopup, setShowFreePopup] = useState(false);

    const toggleFullCalendar = () => {
        const newMode = mode === 'liberty' ? 'suggestions' : 'liberty';
        const defaultMsg = 'Para ti tenho todo o tempo do mundo...';
        const defaultGif = 'https://media.tenor.com/CAtqFqK_2i0AAAAd/dance-girl.gif';

        updateQuestion(step.id, {
            config: {
                ...config,
                mode: newMode,
                libertyMessage: config.libertyMessage || defaultMsg,
                libertyGif: config.libertyGif || defaultGif
            }
        });

        if (newMode === 'liberty') {
            setShowFreePopup(true);
            setTimeout(() => setShowFreePopup(false), 1500);
        }
    };

    const rangeLabel = (() => {
        const s = MONTH_NAMES[today.getMonth()];
        const e = MONTH_NAMES[end.getMonth()];
        return s === e
            ? `${s}. ${end.getFullYear()}`
            : `${s}. → ${e}. ${end.getFullYear()}`;
    })();

    return (
        <div className="space-y-6">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-black text-pink-500 uppercase tracking-widest">{step.stepLabel || 'STEP 3. WHEN ARE YOU FREE?'}</h2>

                {/* Offer Full Calendar Toggle */}
                <div className="flex items-center justify-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer scale-90">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={mode === 'liberty'}
                            onChange={toggleFullCalendar}
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Oferecer Calendário Completo
                    </span>
                </div>

                <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-800 uppercase tracking-tighter">Escolha as datas:</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Próximos 30 dias: {rangeLabel}</p>
                </div>
            </div>

            {showFreePopup && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white p-3 rounded-2xl shadow-2xl border-2 border-pink-100 text-center space-y-1 max-w-[180px] mx-auto absolute inset-0 m-auto h-fit z-50 overflow-hidden"
                >
                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Modo Livre Ativado!</p>
                </motion.div>
            )}

            {mode === 'liberty' ? (
                <div className="space-y-4">


                    {/* Liberty Popup Settings */}
                    <div className="bg-gray-50/80 p-6 rounded-[2rem] border border-gray-100 space-y-4 text-left shadow-inner">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Popup para ela (Modo Free)</p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-gray-300 uppercase ml-2 tracking-widest">Mensagem</span>
                            <input
                                value={config.libertyMessage || 'Para ti tenho todo o tempo do mundo...'}
                                onChange={(e) => updateQuestion(step.id, { config: { ...config, libertyMessage: e.target.value } })}
                                placeholder="Mensagem do popup..."
                                className="w-full bg-white px-4 py-3 rounded-xl border border-gray-100 text-xs font-medium text-gray-700 outline-none focus:border-pink-300 transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-gray-300 uppercase ml-2 tracking-widest">GIF URL</span>
                            <div className="flex items-center gap-3">
                                {config.libertyGif && (
                                    <img src={config.libertyGif} className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm" alt="Preview" />
                                )}
                                <input
                                    value={config.libertyGif || ''}
                                    onChange={(e) => {
                                        const url = e.target.value;
                                        const SAFE = ['giphy.com', 'tenor.com', 'imgur.com'];
                                        try {
                                            if (url && !SAFE.some(d => new URL(url).hostname.includes(d))) {
                                                alert('Por segurança, usa apenas links do Giphy, Tenor ou Imgur.');
                                                return;
                                            }
                                        } catch { /* ignore invalid URL while typing */ }
                                        updateQuestion(step.id, { config: { ...config, libertyGif: url } });
                                    }}
                                    placeholder="Link do GIF..."
                                    className="flex-1 bg-white px-4 py-3 rounded-xl border border-gray-100 text-[10px] text-gray-400 font-mono outline-none focus:border-pink-300 transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {WEEKDAYS.map(w => (
                            <div key={w} className="text-[10px] font-black text-gray-400 text-center py-1">{w}</div>
                        ))}
                        {calendarDays.map((d, i) => {
                            const dateStr = d.date.toISOString().split('T')[0];
                            const isSelected = suggestedDates.some(sd => sd.date === dateStr);
                            const isEditing = editingDate === dateStr;

                            return (
                                <button
                                    key={i}
                                    disabled={!d.inRange}
                                    onClick={() => toggleDate(dateStr)}
                                    className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-black transition-all relative
                                        ${!d.inRange ? 'opacity-10 cursor-not-allowed' : 'hover:scale-105'}
                                        ${isSelected ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-50 text-gray-400'}
                                        ${isEditing ? 'ring-2 ring-pink-500 ring-offset-2' : ''}
                                    `}
                                >
                                    {d.date.getDate()}
                                    {isSelected && <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm"><Check size={8} className="text-pink-500" strokeWidth={4} /></div>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Editing Section */}
                    {editingDate && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-pink-50 rounded-3xl border border-pink-100 space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Configurar: {editingDate}</p>
                                <button onClick={() => removeDate(editingDate)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Remover dia</button>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center mb-1">Começa às</span>
                                    <div className="flex items-center bg-white rounded-2xl px-4 py-2.5 shadow-sm border border-pink-100/50 group-hover:border-pink-200 transition-all">
                                        <div className="relative">
                                            <select
                                                value={hh}
                                                onChange={e => { setHh(e.target.value); setTimeout(updateTime, 0); }}
                                                className="appearance-none bg-transparent text-xl font-black text-gray-800 outline-none cursor-pointer pr-4"
                                            >
                                                {Array.from({ length: 24 }).map((_, i) => <option key={i} value={String(i).padStart(2, '0')}>{String(i).padStart(2, '0')}</option>)}
                                            </select>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-pink-300">
                                                <ChevronDown size={10} strokeWidth={4} />
                                            </div>
                                        </div>
                                        <span className="mx-3 text-pink-200 font-black text-xl">:</span>
                                        <div className="relative">
                                            <select
                                                value={mm}
                                                onChange={e => { setMm(e.target.value); setTimeout(updateTime, 0); }}
                                                className="appearance-none bg-transparent text-xl font-black text-gray-800 outline-none cursor-pointer pr-4"
                                            >
                                                {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-pink-300">
                                                <ChevronDown size={10} strokeWidth={4} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-pink-200 mt-6 lg:mt-8">
                                    <ChevronRightIcon size={20} strokeWidth={4} />
                                </motion.div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center mb-1">Até às</span>
                                    <div className="flex items-center bg-white rounded-2xl px-4 py-2.5 shadow-sm border border-pink-100/50 group-hover:border-pink-200 transition-all">
                                        <div className="relative">
                                            <select
                                                value={hhe}
                                                onChange={e => { setHhe(e.target.value); setTimeout(updateTime, 0); }}
                                                className="appearance-none bg-transparent text-xl font-black text-gray-800 outline-none cursor-pointer pr-4"
                                            >
                                                {Array.from({ length: 24 }).map((_, j) => <option key={j} value={String(j).padStart(2, '0')}>{String(j).padStart(2, '0')}</option>)}
                                            </select>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-pink-300">
                                                <ChevronDown size={10} strokeWidth={4} />
                                            </div>
                                        </div>
                                        <span className="mx-3 text-pink-200 font-black text-xl">:</span>
                                        <div className="relative">
                                            <select
                                                value={mme}
                                                onChange={e => { setMme(e.target.value); setTimeout(updateTime, 0); }}
                                                className="appearance-none bg-transparent text-xl font-black text-gray-800 outline-none cursor-pointer pr-4"
                                            >
                                                {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-pink-300">
                                                <ChevronDown size={10} strokeWidth={4} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[9px] text-pink-400 font-bold italic text-center leading-tight">Os horários ajudam a decidir se haverá jantar, almoço, etc.</p>
                        </motion.div>
                    )}
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

        // Security Fix: Validate type and size
        const ALLOWED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!ALLOWED.includes(file.type)) {
            alert('Apenas imagens (JPG, PNG, GIF, WEBP) são permitidas.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('O ficheiro é demasiado grande. Máximo 2MB.');
            return;
        }

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
                        onChange={(e) => {
                            const url = e.target.value;
                            const SAFE = ['giphy.com', 'tenor.com', 'imgur.com'];
                            try {
                                if (url && !SAFE.some(d => new URL(url).hostname.includes(d))) {
                                    alert('Por segurança, usa apenas links do Giphy, Tenor ou Imgur.');
                                    return;
                                }
                            } catch { }
                            handleUrlChange(e);
                        }}
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
    const { quizData } = useQuizStore();
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

        // Security Fix: Validate type and size
        const ALLOWED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!ALLOWED.includes(file.type)) {
            alert('Apenas imagens são permitidas.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('Máximo 2MB permitidos.');
            return;
        }

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

    const isSurprise = step.config?.isSurprise || false;

    const toggleSurprise = () => {
        updateQuestion(step.id, {
            config: { ...step.config, isSurprise: !isSurprise }
        });
    };

    return (
        <div className="space-y-8 w-full">
            <div className="text-center space-y-4">
                <textarea
                    value={step.title}
                    onChange={(e) => updateQuestion(step.id, { title: e.target.value })}
                    rows={2}
                    maxLength={100}
                    className="w-full text-center text-3xl font-black text-gray-800 bg-transparent outline-none placeholder-gray-300 pb-2 border-b-2 border-gray-100 focus:border-pink-400 resize-none overflow-hidden"
                />

                <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        TU ESCOLHES AS OPÇÕES → ELAS ORDENAM
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-pink-100/50 border border-pink-50 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-rose-400" />

                {/* Image Card Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {options.map((opt, idx) => {
                        const label = typeof opt === 'object' ? opt.label : opt;
                        const image = typeof opt === 'object' ? opt.image : '';
                        const excluded = typeof opt === 'object' ? !!opt.excluded : false;

                        return (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleOption(idx)}
                                className="flex flex-col items-center gap-2 group cursor-pointer"
                            >
                                {/* Image Container */}
                                <div className={`relative aspect-square w-full rounded-[2rem] overflow-hidden transition-all
                                    ${excluded ? 'opacity-40 grayscale border-2 border-dashed border-gray-200' : 'shadow-xl shadow-pink-100/20 border-2 border-white'}
                                `}>
                                    {image
                                        ? <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={label} />
                                        : <div className="w-full h-full flex items-center justify-center text-4xl bg-pink-50/50">{label.match(/\p{Emoji}/u)?.[0] || '🍽️'}</div>
                                    }

                                    {/* Remove button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeOption(idx); }}
                                        className="absolute top-2 left-2 w-7 h-7 bg-rose-500/90 backdrop-blur-sm rounded-full items-center justify-center shadow-lg border-2 border-white hidden group-hover:flex transition-all hover:scale-110 z-20"
                                    >
                                        <X size={14} className="text-white" strokeWidth={4} />
                                    </button>

                                    {/* Checkmark overlay */}
                                    {!excluded && (
                                        <div className="absolute top-2 right-2 w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20">
                                            <Check size={14} className="text-white" strokeWidth={4} />
                                        </div>
                                    )}
                                </div>

                                {/* Label below image */}
                                <p className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${excluded ? 'text-gray-300' : 'text-gray-800'}`}>
                                    {label}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Add your own section */}
                <div className="border-t-2 border-dashed border-gray-100 pt-8 space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OU ADICIONA AS TUAS PRÓPRIAS:</p>
                        <p className="text-[9px] text-gray-300 font-bold leading-relaxed px-8">
                            Dica: Escreve um nome, (opcional) faz upload de uma imagem e clica em <strong>"Adicionar Opção"</strong>.
                        </p>
                    </div>

                    <div className="space-y-4 max-w-sm mx-auto">
                        <input
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Ex: Tacos 🌮"
                            maxLength={50}
                            className="w-full text-center text-sm p-4 rounded-2xl border-2 border-gray-100 focus:border-pink-400 outline-none text-gray-700 font-bold shadow-inner bg-gray-50/50"
                            onKeyDown={(e) => e.key === 'Enter' && addCustomOption()}
                        />

                        {customImagePreview && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative w-24 h-24 mx-auto rounded-[1.5rem] overflow-hidden border-4 border-pink-200 shadow-xl">
                                <img src={customImagePreview} className="w-full h-full object-cover" alt="preview" />
                                <button
                                    onClick={() => { setCustomImagePreview(null); setCustomImageData(null); }}
                                    className="absolute top-1 right-1 bg-rose-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white"
                                >
                                    <X size={10} className="text-white" strokeWidth={4} />
                                </button>
                            </motion.div>
                        )}

                        <div className="flex flex-col gap-3">
                            {quizData.templateId !== 'first_date' && (
                                <>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-3 bg-white border-2 border-pink-200 text-pink-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-pink-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Upload size={16} strokeWidth={3} /> Passo 1: Upload de Imagem
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </>
                            )}

                            <button
                                onClick={addCustomOption}
                                disabled={!customName.trim()}
                                className="w-full py-4 bg-pink-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-pink-600 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-pink-200"
                            >
                                {quizData.templateId === 'first_date' ? '+ Adicionar Opção' : '+ Passo 2: Adicionar Opção'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Surprise Toggle for Conditional Steps */}
            {step.showIf && (
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={toggleSurprise}
                    className={`flex items-center justify-between p-5 rounded-[2rem] cursor-pointer transition-all border-2 max-w-sm mx-auto
                        ${isSurprise
                            ? 'bg-rose-50 border-rose-200 shadow-lg shadow-rose-100/50'
                            : 'bg-white border-gray-100'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner ${isSurprise ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {isSurprise ? '✨' : '👀'}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Modo Surpresa</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                {isSurprise ? 'Oculto dela, tu decides!' : 'Ela verá e escolherá a favorita.'}
                            </p>
                        </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-all ${isSurprise ? 'bg-rose-500' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${isSurprise ? 'right-1' : 'left-1'}`} />
                    </div>
                </motion.div>
            )}
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

    // Filter active steps based on dynamic logic
    const activeSteps = resolveActiveSteps(quizData.questions, {}, { isCreatorMode: true });

    const currentStep = activeSteps[currentStepIndex];
    const isLastStep = currentStepIndex === activeSteps.length - 1;

    const handleNext = () => {
        if (currentStepIndex < activeSteps.length - 1) {
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

            case 'message':
                return (
                    <div className="space-y-6 text-center">
                        <h2 className="text-2xl font-black text-pink-500 uppercase tracking-wide">
                            {currentStep.stepLabel}
                        </h2>
                        <textarea
                            value={currentStep.title}
                            onChange={(e) => updateQuestion(currentStep.id, { title: e.target.value })}
                            rows={2}
                            maxLength={100}
                            placeholder="Título da mensagem (ex: Mensagem de preparação...)"
                            className="w-full text-center text-3xl font-black text-gray-800 bg-transparent border-b-2 border-gray-200 focus:border-pink-500 focus:outline-none pb-2 placeholder-gray-300 resize-none overflow-hidden"
                        />
                        <textarea
                            value={currentStep.subtitle || ''}
                            onChange={(e) => updateQuestion(currentStep.id, { subtitle: e.target.value })}
                            rows={3}
                            maxLength={500}
                            className="w-full text-center text-sm font-medium text-gray-400 bg-transparent border-none focus:outline-none resize-none overflow-hidden"
                            placeholder="Escreve um toque pessoal..."
                        />
                    </div>
                );

            case 'question':
                return (
                    <div className="space-y-6 text-center">
                        {/* Step Label */}
                        <h2 className="text-2xl font-black text-pink-500 uppercase tracking-wide">
                            {currentStep.stepLabel}
                        </h2>

                        {/* Editable Question Title */}
                        <textarea
                            value={currentStep.title}
                            onChange={(e) => updateQuestion(currentStep.id, { title: e.target.value })}
                            rows={3}
                            className="w-full text-center text-3xl font-black text-gray-800 bg-transparent border-b-2 border-gray-200 focus:border-pink-500 focus:outline-none pb-2 placeholder-gray-300 resize-none overflow-hidden"
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

                        {!currentStep.gif && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase block mb-2">Imagem / GIF (Opcional)</span>
                                <input
                                    value={''}
                                    onChange={(e) => {
                                        const url = e.target.value;
                                        const SAFE = ['giphy.com', 'tenor.com', 'imgur.com', 'media.tenor.com'];
                                        try {
                                            if (url && !SAFE.some(d => new URL(url).hostname.includes(d))) {
                                                alert('Por segurança, usa apenas links do Giphy, Tenor ou Imgur.');
                                                return;
                                            }
                                        } catch { }
                                        updateQuestion(currentStep.id, { gif: url });
                                    }}
                                    placeholder="Cola o link do GIF ou imagem..."
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
                        <textarea
                            value={currentStep.title}
                            onChange={(e) => updateQuestion(currentStep.id, { title: e.target.value })}
                            rows={2}
                            className="w-full text-center text-2xl font-black text-gray-800 bg-transparent outline-none border-b-2 border-gray-100 focus:border-pink-400 pb-2 resize-none overflow-hidden"
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
                                <span className="text-xs font-bold text-gray-400 uppercase block mb-2">GIF Debaixo das Estrelas (Opcional)</span>
                                <input
                                    value={''}
                                    onChange={(e) => {
                                        const url = e.target.value;
                                        const SAFE = ['giphy.com', 'tenor.com', 'imgur.com', 'media.tenor.com'];
                                        try {
                                            if (url && !SAFE.some(d => new URL(url).hostname.includes(d))) {
                                                alert('Por segurança, usa apenas links do Giphy, Tenor ou Imgur.');
                                                return;
                                            }
                                        } catch { }
                                        updateQuestion(currentStep.id, { gif: url });
                                    }}
                                    placeholder="Cola o link do GIF ou imagem..."
                                    className="w-full text-sm p-2 rounded-lg border border-gray-200 focus:border-pink-400 outline-none text-center"
                                />
                            </div>
                        )}
                    </div>
                );

            case 'summary': {
                const allQ = quizData.questions;
                const calQ = allQ.find(q => q.type === 'calendar');
                const foodQ = allQ.find(q => q.id === 'step_food' || q.id === 'step_lunch' || q.id === 'step_dinner');
                const actQ = allQ.find(q => q.id === 'step_activity' || q.id === 'step_after_activity');
                const snackQ = allQ.find(q => q.id === 'step_snack');
                const nightQ = allQ.find(q => q.id === 'step_night_out');
                const firstActive = (q) => q?.options?.filter(o => !o.excluded)?.[0]?.label;

                const summaryItems = [
                    { emoji: '📅', label: 'Calendário', value: calQ?.config?.mode === 'liberty' ? 'Modo livre — ela escolhe qualquer dia' : `${calQ?.config?.suggestedDates?.length || 0} dia(s) sugerido(s)` },
                    { emoji: '🍽️', label: 'Comida', value: firstActive(foodQ) ? `${firstActive(foodQ)} + mais opções` : null },
                    { emoji: '☕', label: 'Lanche', value: firstActive(snackQ) ? `${firstActive(snackQ)} + mais opções` : null },
                    { emoji: '🎯', label: 'Atividade', value: firstActive(actQ) ? `${firstActive(actQ)} + mais opções` : null },
                    { emoji: '🌙', label: 'Noite', value: firstActive(nightQ) ? `${firstActive(nightQ)} + mais opções` : null },
                ].filter(i => i.value);

                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight text-center">Pronto para enviar?</h2>

                        {/* Resumo do que o criador configurou */}
                        {summaryItems.length > 0 && (
                            <div className="bg-pink-50 rounded-[1.5rem] p-5 space-y-3 border border-pink-100">
                                <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest text-center mb-1">
                                    O que ela vai ver no convite
                                </p>
                                {summaryItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-pink-50">
                                        <span className="text-lg">{item.emoji}</span>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{item.label}</p>
                                            <p className="text-xs font-black text-gray-700">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Creator Note — só no Especial */}
                        {quizData.templateId !== 'first_date' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-black">YU</div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">A tua mensagem especial para ela</span>
                                </div>
                                <div className="relative">
                                    <textarea
                                        value={calQ?.config?.creatorNote || ''}
                                        onChange={(e) => {
                                            if (calQ) updateQuestion(calQ.id, { config: { ...calQ.config, creatorNote: e.target.value } });
                                        }}
                                        placeholder="Escreve algo fofinho... (Ex: Mal posso esperar para te ver! 💕)"
                                        className="w-full h-28 bg-white p-5 rounded-[1.5rem] rounded-tl-none shadow-md border-2 border-pink-100 text-gray-700 font-medium outline-none focus:border-pink-300 transition-all resize-none italic text-sm"
                                    />
                                    <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-l-2 border-t-2 border-pink-100 rotate-[-45deg]" />
                                </div>
                                <p className="text-[9px] text-pink-400 font-bold uppercase tracking-widest text-center animate-pulse">
                                    ✨ Aparece com animação no final do convite dela!
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl font-black text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                        >
                            {isSaving ? 'A CRIAR...' : 'GUARDAR & ENVIAR 💌'}
                        </button>
                    </div>
                );
            }

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
                <div className="font-black text-pink-500 uppercase tracking-widest text-[10px]">
                    Passo {currentStepIndex + 1} de {activeSteps.length}
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
                                    Próximo Passo <ChevronRight size={18} />
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

                            <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight leading-tight">Tudo pronto! 💖</h2>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-relaxed">Guarda o teu link!</p>

                            {/* Link for the girl */}
                            <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 text-left space-y-2">
                                <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">💌 Envia este link para ela </p>
                                <div className="flex gap-2">
                                    <input readOnly value={window.location.origin + createdLinks.publicLink} className="flex-1 bg-white border border-pink-300 rounded-lg p-2 text-sm text-gray-600 font-mono" />
                                    <button onClick={() => navigator.clipboard.writeText(window.location.origin + createdLinks.publicLink)} className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition-colors">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Link for the creator */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left space-y-2">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">👀 Vê as tuas respostas aqui</p>
                                <div className="flex gap-2">
                                    <input readOnly value={window.location.origin + createdLinks.privateLink} className="flex-1 bg-white border border-gray-300 rounded-lg p-2 text-sm text-gray-600 font-mono" />
                                    <button onClick={() => navigator.clipboard.writeText(window.location.origin + createdLinks.privateLink)} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-black transition-colors">
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            <button onClick={() => window.location.href = createdLinks.privateLink} className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-pink-200 uppercase tracking-widest text-xs">
                                Ir para o Painel →
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
