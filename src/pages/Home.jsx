
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES } from '../data/templates';
import useQuizStore from '../store/useQuizStore';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Calendar, Play, X, ChevronRight } from 'lucide-react';

import heroCouple1 from '../assets/hero-couple.png';
import heroCouple2 from '../assets/hero-couple-2.png';
import FlirtDeckPreview from './FlirtDeckPreview';

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [previewData, setPreviewData] = useState({
        intro: { name: 'Miguel', tagline: 'Not your average date. 😏', photo: null },
        whyMe: [
            { emoji: '🎯', title: 'I actually plan things', desc: "Reservations made. Playlist ready." },
            { emoji: '🌙', title: 'Better in person', desc: 'This deck is already good.' },
            { emoji: '🤝', title: 'Zero games', desc: 'What you see is what you get.' },
        ],
        funFacts: ['I can make pancakes at 2am 🥞', 'I know every lyric 🎵', 'I never check my phone during movies 📵'],
        redFlags: [
            { flag: 'I over-explain things', severity: 1 },
            { flag: 'Terrible at replying to voice notes', severity: 2 },
            { flag: "I'll rate restaurants internally", severity: 1 },
        ],
    });
    const { setTemplate } = useQuizStore();
    const navigate = useNavigate();

    const handleSelectMode = (modeId) => {
        setTemplate(modeId);
        navigate('/criar');
    };

    return (
        <div className="min-h-screen font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden">

            {/* Background Gradient Animado */}
            <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-200 via-pink-50 to-white opacity-80"></div>

            {/* Top Banner (Countdown Fake) */}
            <div className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-2 text-sm font-bold tracking-wide shadow-md">
                ❤️Free o
            </div>

            {/* Navbar Floating Pill */}
            <nav className="flex justify-center mt-6 sticky top-4 z-40 px-4">
                <div className="bg-white/90 backdrop-blur-md rounded-full px-8 py-3 shadow-lg border border-pink-100 flex items-center justify-between w-full max-w-4xl">
                    <div className="font-extrabold text-2xl text-pink-600 tracking-tighter">
                        DateWithMe
                    </div>
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

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 mt-12 md:mt-20 flex flex-col md:flex-row items-center gap-12 mb-32">

                {/* Texto (Lado Esquerdo) */}
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
                        CREATE DEMO INVITATION NO SIGNUP NEEDED
                    </motion.button>

                    <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-sm font-bold text-gray-500">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                        </div>
                        Join 87,459+ happy couples!
                    </div>
                </div>

                {/* Imagens (Lado Direito) */}
                <div className="flex-1 relative w-full max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <img
                            src={heroCouple1}
                            alt="Couple Date"
                            className="rounded-[2rem] border-8 border-white shadow-2xl rotate-3 transform hover:rotate-0 transition-all duration-500 w-full"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="absolute -bottom-10 -left-10 w-2/3 z-20"
                    >
                        <img
                            src={heroCouple2}
                            alt="Coffee Date"
                            className="rounded-[2rem] border-8 border-white shadow-2xl -rotate-6 transform hover:rotate-0 transition-all duration-500"
                        />
                    </motion.div>
                </div>

            </main>

            {/* How It Works Section */}
            <section className="text-center py-20 px-6">
                <h2 className="text-3xl md:text-5xl font-black text-pink-600 mb-16 uppercase tracking-tight">
                    How it Works: Choose Food, Activity & Time
                </h2>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: 1, title: 'Create Invitation', desc: 'Choose your ideal date and time, select a meal, and even pick an activity if you wish.' },
                        { step: 2, title: 'Share the Link', desc: 'We transform your choices into an adorable Invitation to send to your special someone.' },
                        { step: 3, title: 'Get a Yes!', desc: 'Your loved one fills out the invitation, and you view their reply on your dashboard.' }
                    ].map((item) => (
                        <div key={item.step} className="bg-white/60 p-10 rounded-[2rem] shadow-lg border border-pink-50 hover:bg-white transition-colors cursor-default">
                            <div className="w-12 h-12 bg-pink-500 rounded-full text-white flex items-center justify-center font-bold text-xl mx-auto mb-6 shadow-lg shadow-pink-500/30">
                                {item.step}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="text-center py-20 px-6 mb-20">
                <h2 className="text-3xl md:text-5xl font-black text-pink-600 mb-16">
                    PlanYour.Date Helps You Shine
                </h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Star, title: 'Create Lasting Impressions', desc: 'Make every date memorable with unique experiences tailored to your style.' },
                        { icon: Heart, title: 'Foster Authentic Romance', desc: 'Let every date be a celebration of your unique bond. We handle the details.' },
                        { icon: Calendar, title: 'Save Time & Boost Confidence', desc: 'Eliminate second-guessing. Curated suggestions let you pick with confidence.' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/80 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow">
                            <item.icon size={48} className="mx-auto mb-6 text-orange-400 fill-orange-400" />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TikTok Section */}
            <section className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden mb-32 flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-10 relative">
                    <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1596701833075-4d7a465191c2?q=80&w=2670&auto=format&fit=crop)' }}></div>
                    <div className="relative z-10 w-16 h-16 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                        <Play className="ml-1 text-gray-800" fill="currentColor" />
                    </div>
                    <div className="absolute bottom-4 text-white font-bold text-sm drop-shadow-md">Watch on TikTok</div>
                </div>
                <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-black text-pink-600 mb-6">
                        The Viral TikTok Date Invitation Trend
                    </h2>
                    <p className="text-gray-600 mb-8 font-medium">
                        Join the trend! Watch how thousands of couples create their perfect date in seconds.
                        <br /><br />
                        Ready to make your next date night extra special?
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-pink-500 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-pink-600 transition-colors uppercase text-sm w-max"
                    >
                        Create Yours Now
                    </button>
                    <div className="mt-6 flex gap-4 text-pink-500 text-xs font-bold uppercase">
                        <span>How it Works</span>
                        <span>|</span>
                        <span>Browse Date Ideas</span>
                    </div>
                </div>
            </section>

            {/* Footer Minimal */}
            <footer className="text-center pb-10 text-gray-400 text-sm font-medium">
                © 2026 PlanYour.Date. All rights reserved.
                <div className="flex justify-center gap-4 mt-4">
                    <span>Instagram</span>
                    <span>TikTok</span>
                </div>
            </footer>


            {/* MODAL DE ESCOLHA */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setIsModalOpen(false); setModalStep(1); }}
                            className="absolute inset-0 bg-pink-900/40 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl relative z-10 overflow-hidden"
                        >
                            <div className="p-10">

                                {/* Header com Botão de Fechar */}
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-800">
                                            {modalStep === 1 ? "What's the plan? ✨" : "Choose your Vibe 💖"}
                                        </h2>
                                        <p className="text-gray-500 font-medium">
                                            {modalStep === 1 ? "Start by inviting someone special." : "Select a template to customize."}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { setIsModalOpen(false); setModalStep(1); }}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                </div>

                                {/* STEP 1: Botão Único */}
                                {modalStep === 1 && (
                                    <div className="py-10">
                                        <div className="flex items-center justify-between gap-8">
                                            <div className="w-1/3 h-56 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setModalStep(2)}
                                                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:shadow-pink-500/40 transition-all flex items-center gap-2"
                                                >
                                                    <Heart className="fill-white animate-pulse" size={28} />
                                                    Invite for a Date
                                                </motion.button>
                                            </div>

                                            <div className="w-1/3 h-56 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setModalStep(3)}
                                                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                                >
                                                    View Flirt Deck
                                                </motion.button>
                                            </div>
                                        </div>

                                        <p className="mt-6 text-center text-gray-400 text-sm font-medium">
                                            Click to see the magic templates or preview the dynamic Flirt Deck 👆
                                        </p>
                                    </div>
                                )}

                                {/* STEP 2: Grelha de Templates */}
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
                                                className="group flex flex-col items-start p-6 rounded-3xl border-2 border-transparent hover:border-pink-500 bg-gray-50 hover:bg-pink-50 transition-all duration-300 text-left relative overflow-hidden"
                                            >
                                                <div className="bg-white p-3 rounded-2xl mb-3 group-hover:scale-110 transition-transform shadow-sm text-2xl">
                                                    {template.label.includes('First') ? '🌸' :
                                                        template.label.includes('Special') ? '✨' : '🎲'}
                                                </div>
                                                <h3 className="font-extrabold text-gray-900 text-lg mb-1">
                                                    {template.label}
                                                </h3>
                                                <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">
                                                    {template.description || "Perfect for creating a special moment."}
                                                </p>

                                                <div className="mt-auto w-full border-t border-gray-200 pt-3 flex justify-between items-center group-hover:border-pink-200">
                                                    <span className="text-xs font-bold text-gray-400 group-hover:text-pink-600 uppercase tracking-wide transition-colors">Select</span>
                                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-pink-600 transition-colors" />
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}

                                {modalStep === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="w-full h-[70vh] overflow-hidden bg-transparent p-4"
                                    >
                                        <div className="flex gap-6 h-full">
                                            {/* Left: editor form */}
                                            <div className="w-1/2 overflow-auto p-4">
                                                <h3 className="text-lg font-bold mb-3">Presentation Editor</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                                        <input value={previewData.intro.name} onChange={(e) => setPreviewData(d => ({ ...d, intro: { ...d.intro, name: e.target.value } }))} className="mt-1 w-full rounded-md border px-3 py-2" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Tagline</label>
                                                        <input value={previewData.intro.tagline} onChange={(e) => setPreviewData(d => ({ ...d, intro: { ...d.intro, tagline: e.target.value } }))} className="mt-1 w-full rounded-md border px-3 py-2" />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Why Me (editable)</label>
                                                        <div className="space-y-2 mt-2">
                                                            {previewData.whyMe.map((w, idx) => (
                                                                <div key={idx} className="flex gap-2">
                                                                    <input value={w.emoji} onChange={(e) => {
                                                                        const copy = [...previewData.whyMe]; copy[idx].emoji = e.target.value; setPreviewData(d => ({ ...d, whyMe: copy }));
                                                                    }} className="w-12 rounded-md border px-2" />
                                                                    <input value={w.title} onChange={(e) => {
                                                                        const copy = [...previewData.whyMe]; copy[idx].title = e.target.value; setPreviewData(d => ({ ...d, whyMe: copy }));
                                                                    }} className="flex-1 rounded-md border px-2" />
                                                                    <input value={w.desc} onChange={(e) => {
                                                                        const copy = [...previewData.whyMe]; copy[idx].desc = e.target.value; setPreviewData(d => ({ ...d, whyMe: copy }));
                                                                    }} className="flex-1 rounded-md border px-2" />
                                                                </div>
                                                            ))}
                                                            <button onClick={() => setPreviewData(d => ({ ...d, whyMe: [...d.whyMe, { emoji: '✨', title: 'New', desc: 'Description' }] }))} className="mt-2 px-3 py-1 rounded bg-pink-500 text-white">Add</button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Fun Facts</label>
                                                        <div className="space-y-2 mt-2">
                                                            {previewData.funFacts.map((f, i) => (
                                                                <div key={i} className="flex gap-2">
                                                                    <input value={f} onChange={(e) => { const copy = [...previewData.funFacts]; copy[i] = e.target.value; setPreviewData(d => ({ ...d, funFacts: copy })); }} className="flex-1 rounded-md border px-2" />
                                                                </div>
                                                            ))}
                                                            <button onClick={() => setPreviewData(d => ({ ...d, funFacts: [...d.funFacts, 'New fun fact'] }))} className="mt-2 px-3 py-1 rounded bg-pink-500 text-white">Add</button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Red Flags</label>
                                                        <div className="space-y-2 mt-2">
                                                            {previewData.redFlags.map((r, i) => (
                                                                <div key={i} className="flex gap-2 items-center">
                                                                    <input value={r.flag} onChange={(e) => { const copy = [...previewData.redFlags]; copy[i].flag = e.target.value; setPreviewData(d => ({ ...d, redFlags: copy })); }} className="flex-1 rounded-md border px-2" />
                                                                    <select value={r.severity} onChange={(e) => { const copy = [...previewData.redFlags]; copy[i].severity = Number(e.target.value); setPreviewData(d => ({ ...d, redFlags: copy })); }} className="rounded-md border px-2 py-1">
                                                                        <option value={1}>1</option>
                                                                        <option value={2}>2</option>
                                                                        <option value={3}>3</option>
                                                                    </select>
                                                                </div>
                                                            ))}
                                                            <button onClick={() => setPreviewData(d => ({ ...d, redFlags: [...d.redFlags, { flag: 'New red flag', severity: 1 }] }))} className="mt-2 px-3 py-1 rounded bg-pink-500 text-white">Add</button>
                                                        </div>
                                                    </div>

                                                    <div className="pt-3 border-t mt-2">
                                                        <button onClick={() => {
                                                            try {
                                                                const str = JSON.stringify(previewData);
                                                                const b64 = btoa(unescape(encodeURIComponent(str)));
                                                                const url = `${window.location.origin}/flirt-preview?d=${b64}`;
                                                                navigator.clipboard?.writeText(url);
                                                                window.open(url, '_blank');
                                                            } catch (e) { console.error(e); alert('Failed to generate link'); }
                                                        }} className="px-4 py-2 rounded bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold">Generate & Open Link</button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: live preview */}
                                            <div className="w-1/2 rounded-md bg-black/5 p-2 flex items-stretch justify-center">
                                                <div className="w-full h-full rounded-md overflow-auto">
                                                    <FlirtDeckPreview data={previewData} />
                                                </div>
                                            </div>
                                        </div>
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
