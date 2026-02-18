import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES } from '../data/templates';
import useQuizStore from '../store/useQuizStore';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Calendar, Play, X, ChevronRight, Trash2, Plus, Copy, Check, Smartphone, Tablet } from 'lucide-react';
import { supabase } from '../lib/supabase';

import heroCouple1 from '../assets/hero-couple.png';
import heroCouple2 from '../assets/hero-couple-2.png';

// ── Import do FlirtDeck real (com prop compact) ──────────────────
import FlirtDeck from './FlirtDeck';

// ── Dados default do deck ────────────────────────────────────────
const DEFAULT_DECK = {
    intro: { name: 'Miguel', tagline: 'Not your average date. 😏', photo: null, gif: null },
    whyMe: [
        { emoji: '🎯', title: 'I actually plan things', desc: 'Reservations made. Playlist ready.' },
        { emoji: '🌙', title: 'Better in person', desc: 'This deck is already good.' },
        { emoji: '🤝', title: 'Zero games', desc: 'What you see is what you get.' },
    ],
    funFacts: [
        'I can make pancakes at 2am 🥞',
        'I know every lyric 🎵',
        'I never check my phone during movies 📵',
    ],
    redFlags: [
        { flag: 'I over-explain things', severity: 1 },
        { flag: 'Terrible at replying to voice notes', severity: 2 },
        { flag: "I'll rate restaurants internally", severity: 1 },
    ],
};

// ── Helpers de estilo do editor ──────────────────────────────────
const iStyle = {
    width: '100%',
    padding: '7px 11px',
    borderRadius: 9,
    border: '1px solid #fecdd3',
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
    background: '#fff',
    color: '#1a0a10',
    boxSizing: 'border-box',
};

function EInput({ value, onChange, placeholder, style }) {
    return (
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{ ...iStyle, ...style }}
        />
    );
}

function ESection({ title, children }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <p style={{
                fontSize: 10, fontWeight: 800, color: '#f43f5e',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: 8, paddingBottom: 5,
                borderBottom: '1px solid #fecdd3',
            }}>
                {title}
            </p>
            {children}
        </div>
    );
}

// ── Gera o link shareable com os dados do deck ───────────────────
function generateDeckLink(deckData) {
    const str = JSON.stringify(deckData);
    const b64 = btoa(unescape(encodeURIComponent(str)));
    return `${window.location.origin}/flirt-deck?d=${b64}`;
}

// ════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════
export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [deckData, setDeckData] = useState(DEFAULT_DECK);
    const [copied, setCopied] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { setTemplate } = useQuizStore();
    const navigate = useNavigate();

    const closeModal = () => { setIsModalOpen(false); setModalStep(1); };
    const handleSelectMode = (modeId) => { setTemplate(modeId); navigate('/criar'); };

    // ── Funções de update do deck ────────────────────────────────
    const updIntro = (field, val) =>
        setDeckData(d => ({ ...d, intro: { ...d.intro, [field]: val } }));

    const updWhyMe = (idx, field, val) =>
        setDeckData(d => {
            const copy = d.whyMe.map((w, i) => i === idx ? { ...w, [field]: val } : w);
            return { ...d, whyMe: copy };
        });

    const addWhyMe = () =>
        setDeckData(d => ({ ...d, whyMe: [...d.whyMe, { emoji: '✨', title: 'New reason', desc: 'Describe it...' }] }));

    const removeWhyMe = (idx) =>
        setDeckData(d => ({ ...d, whyMe: d.whyMe.filter((_, i) => i !== idx) }));

    const updFact = (idx, val) =>
        setDeckData(d => {
            const copy = [...d.funFacts];
            copy[idx] = val;
            return { ...d, funFacts: copy };
        });

    const addFact = () =>
        setDeckData(d => ({ ...d, funFacts: [...d.funFacts, 'New fun fact 🎉'] }));

    const removeFact = (idx) =>
        setDeckData(d => ({ ...d, funFacts: d.funFacts.filter((_, i) => i !== idx) }));

    const updFlag = (idx, field, val) =>
        setDeckData(d => {
            const copy = d.redFlags.map((r, i) => i === idx ? { ...r, [field]: val } : r);
            return { ...d, redFlags: copy };
        });

    const addFlag = () =>
        setDeckData(d => ({ ...d, redFlags: [...d.redFlags, { flag: 'New red flag', severity: 1 }] }));

    const removeFlag = (idx) =>
        setDeckData(d => ({ ...d, redFlags: d.redFlags.filter((_, i) => i !== idx) }));

    // ── Gerar + copiar link ──────────────────────────────────────
    // ── Gerar + copiar link (Supabase) ──────────────────────────
    const handleGenerateLink = async () => {
        setIsSaving(true);
        try {
            const { data, error } = await supabase
                .from('invites')
                .insert([{
                    content: {
                        type: 'flirt-deck',
                        deckData: deckData
                    },
                    status: 'active'
                }])
                .select()
                .single();

            if (error) throw error;

            const url = `${window.location.origin}/flirt-deck/${data.id}`;
            setGeneratedLink(url);
            navigator.clipboard?.writeText(url).catch(() => { });
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
            window.open(url, '_blank');
        } catch (err) {
            console.error("Error saving flirt deck:", err);
            // Fallback para link local se der erro na DB
            const url = generateDeckLink(deckData);
            setGeneratedLink(url);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopyAgain = () => {
        navigator.clipboard?.writeText(generatedLink).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ════════════════════════════════════════════════════════════
    // RENDER
    // ════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden">

            {/* Background */}
            <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-200 via-pink-50 to-white opacity-80" />

            {/* Top Banner */}
            <div className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-2 text-sm font-bold tracking-wide shadow-md">
                ❤️ Free to use — No signup needed
            </div>

            {/* Navbar */}
            <nav className="flex justify-center mt-6 sticky top-4 z-40 px-4">
                <div className="bg-white/90 backdrop-blur-md rounded-full px-8 py-3 shadow-lg border border-pink-100 flex items-center justify-between w-full max-w-4xl">
                    <div className="font-extrabold text-2xl text-pink-600 tracking-tighter">DateWithMe</div>
                    <div className="flex gap-6 items-center">
                        <a href="#" className="hidden md:block font-bold text-gray-500 hover:text-pink-500 text-sm transition-colors">FAQ</a>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-md transition-all transform hover:scale-105"
                        >
                            GET STARTED
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <main className="max-w-7xl mx-auto px-6 mt-12 md:mt-20 flex flex-col md:flex-row items-center gap-12 mb-32">
                <div className="text-center md:text-left flex-1">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-gray-800 leading-[1.1] mb-6"
                    >
                        Plan Your Next <br />
                        <span className="text-gray-800">Unforgettable Date</span> <br />
                        in Minutes
                    </motion.h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto md:mx-0 font-medium">
                        We handle the details—you focus on the romance!
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-5 rounded-full font-extrabold text-lg shadow-xl shadow-pink-500/30 hover:shadow-2xl transition-all uppercase tracking-wide w-full md:w-auto"
                    >
                        CREATE DEMO INVITATION — NO SIGNUP NEEDED
                    </motion.button>
                    <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm font-bold text-gray-500">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                            <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white" />
                        </div>
                        Join 87,459+ happy couples!
                    </div>
                </div>

                <div className="flex-1 relative w-full max-w-lg">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative z-10">
                        <img src={heroCouple1} alt="Couple Date" className="rounded-[2rem] border-8 border-white shadow-2xl rotate-3 transform hover:rotate-0 transition-all duration-500 w-full" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="absolute -bottom-10 -left-10 w-2/3 z-20">
                        <img src={heroCouple2} alt="Coffee Date" className="rounded-[2rem] border-8 border-white shadow-2xl -rotate-6 transform hover:rotate-0 transition-all duration-500" />
                    </motion.div>
                </div>
            </main>

            {/* How It Works */}
            <section className="text-center py-20 px-6">
                <h2 className="text-3xl md:text-5xl font-black text-pink-600 mb-16 uppercase tracking-tight">
                    How it Works: Choose Food, Activity & Time
                </h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: 1, title: 'Create Invitation', desc: 'Choose your ideal date and time, select a meal, and even pick an activity if you wish.' },
                        { step: 2, title: 'Share the Link', desc: 'We transform your choices into an adorable Invitation to send to your special someone.' },
                        { step: 3, title: 'Get a Yes!', desc: 'Your loved one fills out the invitation, and you view their reply on your dashboard.' },
                    ].map((item) => (
                        <div key={item.step} className="bg-white/60 p-10 rounded-[2rem] shadow-lg border border-pink-50 hover:bg-white transition-colors">
                            <div className="w-12 h-12 bg-pink-500 rounded-full text-white flex items-center justify-center font-bold text-xl mx-auto mb-6 shadow-lg shadow-pink-500/30">{item.step}</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="text-center py-20 px-6 mb-20">
                <h2 className="text-3xl md:text-5xl font-black text-pink-600 mb-16">DateWithMe Helps You Shine</h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Star, title: 'Create Lasting Impressions', desc: 'Make every date memorable with unique experiences tailored to your style.' },
                        { icon: Heart, title: 'Foster Authentic Romance', desc: 'Let every date be a celebration of your unique bond. We handle the details.' },
                        { icon: Calendar, title: 'Save Time & Boost Confidence', desc: 'Eliminate second-guessing. Curated suggestions let you pick with confidence.' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/80 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow">
                            <item.icon size={48} className="mx-auto mb-6 text-orange-400 fill-orange-400" />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TikTok */}
            <section className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden mb-32 flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-10 relative">
                    <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1596701833075-4d7a465191c2?q=80&w=2670&auto=format&fit=crop)' }} />
                    <div className="relative z-10 w-16 h-16 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                        <Play className="ml-1 text-gray-800" fill="currentColor" />
                    </div>
                    <div className="absolute bottom-4 text-white font-bold text-sm drop-shadow-md">Watch on TikTok</div>
                </div>
                <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-black text-pink-600 mb-6">The Viral TikTok Date Invitation Trend</h2>
                    <p className="text-gray-600 mb-8 font-medium">
                        Join the trend! Watch how thousands of couples create their perfect date in seconds.<br /><br />
                        Ready to make your next date night extra special?
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-pink-600 transition-colors uppercase text-sm w-max"
                    >
                        Create Yours Now
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center pb-10 text-gray-400 text-sm font-medium">
                © 2026 DateWithMe. All rights reserved.
                <div className="flex justify-center gap-4 mt-4">
                    <span>Instagram</span>
                    <span>TikTok</span>
                </div>
            </footer>

            {/* ══════════════════════════════════════════════════════
                MODAL PRINCIPAL
            ══════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-pink-900/40 backdrop-blur-sm"
                        />

                        {/* Modal box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl relative z-10 overflow-hidden"
                            style={{ maxHeight: '92vh' }}
                        >
                            <div className="p-8" style={{ maxHeight: '92vh', overflowY: 'auto' }}>

                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-800">
                                            {modalStep === 1 && "What's the plan? ✨"}
                                            {modalStep === 2 && "Choose your Vibe 💖"}
                                            {modalStep === 3 && "FlirtDeck™ Editor 🎴"}
                                        </h2>
                                        <p className="text-gray-500 font-medium text-sm mt-1">
                                            {modalStep === 1 && 'Start by inviting someone special.'}
                                            {modalStep === 2 && 'Select a template to customize.'}
                                            {modalStep === 3 && 'Customize every slide, then share your deck link.'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {modalStep === 3 && (
                                            <button
                                                onClick={() => setModalStep(1)}
                                                className="text-sm font-bold text-gray-400 hover:text-pink-500 px-3 py-1 rounded-full hover:bg-pink-50 transition-all"
                                            >
                                                ← Back
                                            </button>
                                        )}
                                        <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                            <X size={22} className="text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* ── STEP 1: Escolha o modo ── */}
                                {modalStep === 1 && (
                                    <div className="py-8">
                                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">

                                            {/* Card: Invite for a Date */}
                                            <motion.button
                                                whileHover={{ y: -4, scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setModalStep(2)}
                                                className="flex-1 max-w-xs h-56 bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-pink-500 hover:shadow-xl hover:shadow-pink-200/60 transition-all"
                                            >
                                                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                                                    <Heart className="fill-white" size={30} color="white" />
                                                </div>
                                                <div className="text-center px-4">
                                                    <p className="font-black text-gray-800 text-lg leading-tight">Invite for a Date</p>
                                                    <p className="text-xs text-gray-500 mt-1">Interactive step-by-step invitation</p>
                                                </div>
                                            </motion.button>

                                            {/* Divider */}
                                            <div className="flex flex-col items-center gap-2 text-gray-300 font-bold text-sm">
                                                <div className="w-px h-10 bg-gray-200 hidden md:block" />
                                                <span>or</span>
                                                <div className="w-px h-10 bg-gray-200 hidden md:block" />
                                            </div>

                                            {/* Card: FlirtDeck */}
                                            <motion.button
                                                whileHover={{ y: -4, scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setModalStep(3)}
                                                className="flex-1 max-w-xs h-56 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-pink-500 hover:shadow-xl hover:shadow-pink-500/20 transition-all"
                                            >
                                                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30 text-2xl">
                                                    🎴
                                                </div>
                                                <div className="text-center px-4">
                                                    <p className="font-black text-white text-lg leading-tight">FlirtDeck™</p>
                                                    <p className="text-xs text-gray-400 mt-1">Personal presentation to impress your crush</p>
                                                </div>
                                            </motion.button>
                                        </div>

                                        <p className="mt-8 text-center text-gray-400 text-sm font-medium">
                                            Choose how you want to make your move 💕
                                        </p>
                                    </div>
                                )}

                                {/* ── STEP 2: Templates ── */}
                                {modalStep === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        {Object.values(TEMPLATES).map((template) => (
                                            <button
                                                key={template.id}
                                                onClick={() => handleSelectMode(template.id)}
                                                className="group flex flex-col items-start p-6 rounded-3xl border-2 border-transparent hover:border-pink-500 bg-gray-50 hover:bg-pink-50 transition-all duration-300 text-left"
                                            >
                                                <div className="bg-white p-3 rounded-2xl mb-3 group-hover:scale-110 transition-transform shadow-sm text-2xl">
                                                    {template.label?.includes('First') ? '🌸' : template.label?.includes('Special') ? '✨' : '🎲'}
                                                </div>
                                                <h3 className="font-extrabold text-gray-900 text-lg mb-1">{template.label}</h3>
                                                <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">
                                                    {template.description || 'Perfect for creating a special moment.'}
                                                </p>
                                                <div className="mt-auto w-full border-t border-gray-200 pt-3 flex justify-between items-center group-hover:border-pink-200">
                                                    <span className="text-xs font-bold text-gray-400 group-hover:text-pink-600 uppercase tracking-wide transition-colors">Select</span>
                                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-pink-600 transition-colors" />
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {/* ── STEP 3: FlirtDeck Editor + Preview ── */}
                                {modalStep === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col md:flex-row gap-5 h-[68vh] min-h-[500px]"
                                    >
                                        {/* ─── LEFT: Editor ─────────────────────────────── */}
                                        <div className="w-full md:w-[42%] flex-shrink-0 overflow-y-auto pr-4 pb-4 flex flex-col">

                                            {/* Intro */}
                                            <ESection title="Intro">
                                                <div style={{ marginBottom: 8 }}>
                                                    <label style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, display: 'block', marginBottom: 4 }}>NAME</label>
                                                    <EInput
                                                        value={deckData.intro.name}
                                                        onChange={e => updIntro('name', e.target.value)}
                                                        placeholder="Your name"
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, display: 'block', marginBottom: 4 }}>TAGLINE</label>
                                                    <EInput
                                                        value={deckData.intro.tagline}
                                                        onChange={e => updIntro('tagline', e.target.value)}
                                                        placeholder="Not your average date. 😏"
                                                    />
                                                </div>
                                            </ESection>

                                            {/* Why Me */}
                                            <ESection title="Why Me">
                                                {deckData.whyMe.map((w, idx) => (
                                                    <div key={idx} style={{
                                                        background: '#fff5f7', borderRadius: 10,
                                                        padding: '10px 10px 8px', marginBottom: 8,
                                                        border: '1px solid #fecdd3',
                                                    }}>
                                                        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                                                            <EInput
                                                                value={w.emoji}
                                                                onChange={e => updWhyMe(idx, 'emoji', e.target.value)}
                                                                style={{ width: 48, textAlign: 'center', padding: '7px 6px' }}
                                                                placeholder="🎯"
                                                            />
                                                            <EInput
                                                                value={w.title}
                                                                onChange={e => updWhyMe(idx, 'title', e.target.value)}
                                                                placeholder="Title"
                                                                style={{ flex: 1 }}
                                                            />
                                                        </div>
                                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                            <EInput
                                                                value={w.desc}
                                                                onChange={e => updWhyMe(idx, 'desc', e.target.value)}
                                                                placeholder="Short description..."
                                                                style={{ flex: 1 }}
                                                            />
                                                            {deckData.whyMe.length > 1 && (
                                                                <button onClick={() => removeWhyMe(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', padding: '4px', display: 'flex', alignItems: 'center' }}>
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={addWhyMe}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(244,63,94,0.06)', border: '1px dashed #fca5a5', borderRadius: 8, padding: '7px 12px', color: '#f43f5e', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: 4 }}
                                                >
                                                    <Plus size={13} /> Add reason
                                                </button>
                                            </ESection>

                                            {/* Fun Facts */}
                                            <ESection title="Fun Facts">
                                                {deckData.funFacts.map((f, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                                                        <EInput
                                                            value={f}
                                                            onChange={e => updFact(idx, e.target.value)}
                                                            placeholder="Fun fact..."
                                                            style={{ flex: 1 }}
                                                        />
                                                        {deckData.funFacts.length > 1 && (
                                                            <button onClick={() => removeFact(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', padding: '4px', display: 'flex', alignItems: 'center' }}>
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={addFact}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(244,63,94,0.06)', border: '1px dashed #fca5a5', borderRadius: 8, padding: '7px 12px', color: '#f43f5e', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: 4 }}
                                                >
                                                    <Plus size={13} /> Add fact
                                                </button>
                                            </ESection>

                                            {/* Red Flags */}
                                            <ESection title="Red Flags">
                                                {deckData.redFlags.map((r, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                                                        <EInput
                                                            value={r.flag}
                                                            onChange={e => updFlag(idx, 'flag', e.target.value)}
                                                            placeholder="Red flag..."
                                                            style={{ flex: 1 }}
                                                        />
                                                        <select
                                                            value={r.severity}
                                                            onChange={e => updFlag(idx, 'severity', Number(e.target.value))}
                                                            style={{ ...iStyle, width: 54, padding: '7px 4px' }}
                                                        >
                                                            <option value={1}>🟡</option>
                                                            <option value={2}>🟠</option>
                                                            <option value={3}>🔴</option>
                                                        </select>
                                                        {deckData.redFlags.length > 1 && (
                                                            <button onClick={() => removeFlag(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', padding: '4px', display: 'flex', alignItems: 'center' }}>
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={addFlag}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(244,63,94,0.06)', border: '1px dashed #fca5a5', borderRadius: 8, padding: '7px 12px', color: '#f43f5e', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: 4 }}
                                                >
                                                    <Plus size={13} /> Add red flag
                                                </button>
                                            </ESection>

                                            {/* ─── GERAR LINK & PREVIEW ──────────────────────────── */}
                                            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                <button
                                                    onClick={handleGenerateLink}
                                                    disabled={isSaving}
                                                    style={{
                                                        width: '100%', padding: '13px',
                                                        borderRadius: 12,
                                                        background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                                                        border: 'none', color: '#fff',
                                                        fontSize: 14, fontWeight: 800,
                                                        cursor: 'pointer',
                                                        boxShadow: '0 6px 20px rgba(244,63,94,0.35)',
                                                        display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', gap: 8,
                                                        letterSpacing: '0.03em',
                                                        opacity: isSaving ? 0.7 : 1,
                                                    }}
                                                >
                                                    {isSaving ? "Creating..." : <>🔗 Generate & Open Link</>}
                                                </button>

                                                <button
                                                    onClick={() => setIsMobilePreviewOpen(true)}
                                                    className="md:hidden w-full p-[10px] rounded-xl bg-pink-50 border border-pink-100 text-pink-500 text-xs font-bold flex items-center justify-center gap-2"
                                                >
                                                    <Smartphone size={16} /> Open Preview
                                                </button>

                                                {/* Link gerado — mostrar após click */}
                                                <AnimatePresence>
                                                    {generatedLink && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 6 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            style={{
                                                                marginTop: 2,
                                                                background: '#fff5f7',
                                                                border: '1px solid #fca5a5',
                                                                borderRadius: 10,
                                                                padding: '10px 12px',
                                                            }}
                                                        >
                                                            <p style={{ fontSize: 10, fontWeight: 700, color: '#f43f5e', marginBottom: 6, letterSpacing: '0.06em' }}>
                                                                LINK GERADO — PARTILHA COM O TEU CRUSH 💌
                                                            </p>
                                                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                                <input
                                                                    readOnly
                                                                    value={generatedLink}
                                                                    style={{ ...iStyle, fontSize: 11, color: '#6b7280', background: '#fff', cursor: 'text' }}
                                                                    onClick={e => e.target.select()}
                                                                />
                                                                <button
                                                                    onClick={handleCopyAgain}
                                                                    style={{
                                                                        flexShrink: 0, width: 34, height: 34,
                                                                        borderRadius: 8,
                                                                        background: copied ? '#10b981' : '#f43f5e',
                                                                        border: 'none', cursor: 'pointer',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        transition: 'background 0.2s',
                                                                    }}
                                                                >
                                                                    {copied
                                                                        ? <Check size={15} color="white" />
                                                                        : <Copy size={15} color="white" />
                                                                    }
                                                                </button>
                                                            </div>
                                                            {copied && (
                                                                <p style={{ fontSize: 10, color: '#10b981', fontWeight: 700, marginTop: 4 }}>
                                                                    ✓ Link copiado para o clipboard!
                                                                </p>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* ─── RIGHT: Preview live (DESKTOP ONLY) ─── */}
                                        <div className="hidden md:flex flex-1 bg-[#08080c] rounded-3xl overflow-hidden relative items-center justify-center">
                                            <div style={{ position: 'absolute', top: 14, left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
                                                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase' }}>
                                                    PREVIEW LIVE
                                                </span>
                                            </div>
                                            <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                                                <FlirtDeck data={deckData} compact />
                                            </div>
                                        </div>

                                        {/* ─── MOBILE MODAL PREVIEW ─── */}
                                        <AnimatePresence>
                                            {isMobilePreviewOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: '100%' }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: '100%' }}
                                                    className="fixed inset-0 z-[100] bg-black"
                                                >
                                                    <div className="flex flex-col h-full">
                                                        <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <Smartphone size={16} className="text-pink-500" />
                                                                <span className="text-white font-bold text-sm">Preview</span>
                                                            </div>
                                                            <button
                                                                onClick={() => setIsMobilePreviewOpen(false)}
                                                                className="text-gray-400 font-bold text-sm hover:text-white"
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                        <div className="flex-1 overflow-hidden">
                                                            <FlirtDeck data={deckData} />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}