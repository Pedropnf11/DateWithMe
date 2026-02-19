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
    intro: { name: 'Teu Nome', tagline: 'Não é um date qualquer. 😏', photo: null, gif: null },
    whyMe: [
        { emoji: '🎯', title: 'Eu planeio tudo', desc: 'Reservas feitas. Playlist pronta.' },
        { emoji: '🌙', title: 'Melhor ao vivo', desc: 'Este deck já é bom, imagina eu.' },
        { emoji: '🤝', title: 'Sem jogos', desc: 'O que vês é o que tens.' },
    ],
    funFacts: [
        'Consigo fazer panquecas às 2 da manhã 🥞',
        'Sei as letras todas desta música 🎵',
        'Nunca mexo no telemóvel durante os filmes 📵',
    ],
    redFlags: [
        { flag: 'Explico as coisas demais', severity: 1 },
        { flag: 'Terrível a responder a áudios', severity: 2 },
        { flag: "Avalio restaurantes mentalmente", severity: 1 },
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
        setDeckData(d => ({ ...d, whyMe: [...d.whyMe, { emoji: '✨', title: 'Novo motivo', desc: 'Descreve aqui...' }] }));

    const removeWhyMe = (idx) =>
        setDeckData(d => ({ ...d, whyMe: d.whyMe.filter((_, i) => i !== idx) }));

    const updFact = (idx, val) =>
        setDeckData(d => {
            const copy = [...d.funFacts];
            copy[idx] = val;
            return { ...d, funFacts: copy };
        });

    const addFact = () =>
        setDeckData(d => ({ ...d, funFacts: [...d.funFacts, 'Novo facto curioso 🎉'] }));

    const removeFact = (idx) =>
        setDeckData(d => ({ ...d, funFacts: d.funFacts.filter((_, i) => i !== idx) }));

    const updFlag = (idx, field, val) =>
        setDeckData(d => {
            const copy = d.redFlags.map((r, i) => i === idx ? { ...r, [field]: val } : r);
            return { ...d, redFlags: copy };
        });

    const addFlag = () =>
        setDeckData(d => ({ ...d, redFlags: [...d.redFlags, { flag: 'Nova red flag', severity: 1 }] }));

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
            <div className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-2 text-sm font-bold tracking-wide shadow-md uppercase tracking-[0.1em]">
                💌 Grátis. Sem registo. Sem desculpas para não surpreenderes.
            </div>

            {/* Navbar */}
            <nav className="flex justify-center mt-6 sticky top-4 z-40 px-4">
                <div className="bg-white/90 backdrop-blur-md rounded-full px-8 py-3 shadow-lg border border-pink-100 flex items-center justify-between w-full max-w-4xl">
                    <div className="font-extrabold text-2xl text-pink-600 tracking-tighter">DateWithMe</div>
                    <div className="flex gap-6 items-center">
                        <a href="#" className="hidden md:block font-bold text-gray-500 hover:text-pink-500 text-sm transition-colors uppercase tracking-widest text-[10px]">Perguntas Frequentes</a>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-black text-xs shadow-md transition-all transform hover:scale-105 uppercase tracking-widest"
                        >
                            COMEÇAR
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
                        Ela ainda não sabe o que aí vem.
                    </motion.h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
                        Em menos de 3 minutos, crias um convite que ela vai guardar para sempre. Tu escolhes os detalhes — nós tratamos da magia.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-5 rounded-full font-black text-lg shadow-xl shadow-pink-500/30 hover:shadow-2xl transition-all uppercase tracking-wide w-full md:w-auto"
                    >
                        SURPREENDE-A AGORA — É GRÁTIS
                    </motion.button>
                    <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-pink-400">
                        ❤️Várias Pessoas já testaram, junta-te a elas!
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
                    Tão fácil que até tu consegues
                </h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: 1, title: 'Cria o Convite', desc: 'Escolhe o dia, a hora, o jantar e a actividade. Nós montamos tudo num convite lindo que parece que demorou horas a preparar. (Spoiler: não demorou.)' },
                        { step: 2, title: 'Envia o Link', desc: 'Um link. Um clique. E ela recebe algo que nunca esperava. Assim tão simples — assim tão especial.' },
                        { step: 3, title: 'Recebe o SIM', desc: 'Ela responde directamente no convite. Tu vês a resposta no teu painel. E a noite começa antes mesmo de começar.' },
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
                <h2 className="text-3xl md:text-5xl font-black text-pink-600 mb-16 uppercase tracking-tight leading-tight">
                    Porque os detalhes são o que ela vai contar às amigas
                </h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Star, title: 'Uma impressão que fica', desc: 'Qualquer um marca um jantar. Tu vais marcar uma memória. Experiências pensadas ao pormenor, com o teu toque pessoal.' },
                        { icon: Heart, title: 'Romance a sério, sem forçar', desc: 'Sem guiões. Sem awkward silences. Só os dois, num encontro que flui porque foi bem planeado.' },
                        { icon: Calendar, title: 'Confiança em 3 minutos', desc: 'Acabou o "não sei o que fazer". Sugestões pensadas para impressionar — tu decides, nós garantimos que corre bem.' },
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
                    <div className="absolute bottom-4 text-white font-black text-sm drop-shadow-md uppercase tracking-widest">Ver no TikTok</div>
                </div>
                <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-black text-pink-600 mb-6 uppercase tracking-tight leading-tight">
                        O segredo que vai correr o TikTok todo
                    </h2>
                    <p className="text-gray-600 mb-8 font-medium leading-relaxed">
                        Milhares de casais estão a usar o DateWithMe para criar encontros que parecem saídos de um filme. Não é sorte — é ter a ferramenta certa.<br /><br />
                        Pronto para seres o protagonista da próxima história de amor viral?
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-pink-500 text-white px-8 py-4 rounded-full font-black shadow-lg hover:bg-pink-600 transition-colors uppercase text-xs tracking-widest w-max mx-auto md:mx-0"
                    >
                        CRIA O TEU CONVITE AGORA
                    </button>
                </div>
            </section>

            <footer className="text-center pb-10 text-gray-400 text-xs font-black uppercase tracking-widest">
                © 2026 DateWithMe. Todos os direitos reservados.
                <div className="flex justify-center gap-6 mt-4">
                    <span className="cursor-pointer hover:text-pink-400 transition-colors">Instagram</span>
                    <span className="cursor-pointer hover:text-pink-400 transition-colors">TikTok</span>
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
                                        <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
                                            {modalStep === 1 && "Qual é o plano? ✨"}
                                            {modalStep === 2 && "Escolhe a tua Vibe 💖"}
                                            {modalStep === 3 && "Editor FlirtDeck™ 🎴"}
                                        </h2>
                                        <p className="text-gray-400 font-bold text-[10px] mt-1 uppercase tracking-widest">
                                            {modalStep === 1 && 'Começa por convidar alguém especial.'}
                                            {modalStep === 2 && 'Seleciona um template para personalizar.'}
                                            {modalStep === 3 && 'Personaliza cada slide e partilha o teu deck.'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {modalStep === 3 && (
                                            <button
                                                onClick={() => setModalStep(1)}
                                                className="text-[10px] font-black text-gray-400 hover:text-pink-500 px-4 py-2 rounded-full hover:bg-pink-50 transition-all uppercase tracking-widest"
                                            >
                                                ← Voltar
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
                                                    <p className="font-black text-gray-800 text-lg leading-tight uppercase tracking-tight">Convidar para um Date</p>
                                                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Convite interativo passo-a-passo</p>
                                                </div>
                                            </motion.button>

                                            {/* Divider */}
                                            <div className="flex flex-col items-center gap-2 text-gray-300 font-black text-xs uppercase tracking-widest">
                                                <div className="w-px h-10 bg-gray-200 hidden md:block" />
                                                <span>ou</span>
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
                                                    <p className="font-black text-white text-lg leading-tight uppercase tracking-tight">FlirtDeck™</p>
                                                    <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">Apresentação pessoal para a impressionar</p>
                                                </div>
                                            </motion.button>
                                        </div>

                                        <p className="mt-8 text-center text-gray-400 text-[9px] font-black uppercase tracking-[0.2em]">
                                            Escolhe como queres dar o próximo passo 💕
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
                                                <h3 className="font-black text-gray-900 text-lg mb-1 uppercase tracking-tight">{template.label}</h3>
                                                <p className="text-[10px] text-gray-500 mb-4 leading-relaxed font-bold uppercase tracking-widest">
                                                    {template.description || 'Perfeito para criar um momento especial.'}
                                                </p>
                                                <div className="mt-auto w-full border-t border-gray-200 pt-3 flex justify-between items-center group-hover:border-pink-200">
                                                    <span className="text-[10px] font-black text-gray-400 group-hover:text-pink-600 uppercase tracking-widest transition-colors">Selecionar</span>
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
                                            <ESection title="Introdução">
                                                <div style={{ marginBottom: 8 }}>
                                                    <label style={{ fontSize: 9, color: '#9ca3af', fontWeight: 900, display: 'block', marginBottom: 4, letterSpacing: '0.1em' }}>NOME</label>
                                                    <EInput
                                                        value={deckData.intro.name}
                                                        onChange={e => updIntro('name', e.target.value)}
                                                        placeholder="O teu nome"
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: 9, color: '#9ca3af', fontWeight: 900, display: 'block', marginBottom: 4, letterSpacing: '0.1em' }}>TAGLINE</label>
                                                    <EInput
                                                        value={deckData.intro.tagline}
                                                        onChange={e => updIntro('tagline', e.target.value)}
                                                        placeholder="Não é um date qualquer. 😏"
                                                    />
                                                </div>
                                            </ESection>

                                            {/* Why Me */}
                                            <ESection title="Porquê eu?">
                                                {deckData.whyMe.map((w, idx) => (
                                                    <div key={idx} style={{
                                                        background: '#fff', borderRadius: 16,
                                                        padding: '12px', marginBottom: 8,
                                                        border: '1px solid #fecdd3',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                                    }}>
                                                        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                                                            <EInput
                                                                value={w.emoji}
                                                                onChange={e => updWhyMe(idx, 'emoji', e.target.value)}
                                                                style={{ width: 44, textAlign: 'center', padding: '7px 4px' }}
                                                                placeholder="🎯"
                                                            />
                                                            <EInput
                                                                value={w.title}
                                                                onChange={e => updWhyMe(idx, 'title', e.target.value)}
                                                                placeholder="Título"
                                                                style={{ flex: 1 }}
                                                            />
                                                        </div>
                                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                            <EInput
                                                                value={w.desc}
                                                                onChange={e => updWhyMe(idx, 'desc', e.target.value)}
                                                                placeholder="Breve descrição..."
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
                                                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px dashed #fca5a5', borderRadius: 12, padding: '10px 12px', color: '#f43f5e', fontSize: 10, fontWeight: 900, cursor: 'pointer', width: '100%', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                                >
                                                    <Plus size={13} /> Adicionar motivo
                                                </button>
                                            </ESection>

                                            {/* Fun Facts */}
                                            <ESection title="Factos Curiosos">
                                                {deckData.funFacts.map((f, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                                                        <EInput
                                                            value={f}
                                                            onChange={e => updFact(idx, e.target.value)}
                                                            placeholder="Facto curioso..."
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
                                                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px dashed #fca5a5', borderRadius: 12, padding: '10px 12px', color: '#f43f5e', fontSize: 10, fontWeight: 900, cursor: 'pointer', width: '100%', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                                >
                                                    <Plus size={13} /> Adicionar facto
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
                                                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px dashed #fca5a5', borderRadius: 12, padding: '10px 12px', color: '#f43f5e', fontSize: 10, fontWeight: 900, cursor: 'pointer', width: '100%', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                                >
                                                    <Plus size={13} /> Adicionar red flag
                                                </button>
                                            </ESection>

                                            {/* ─── GERAR LINK & PREVIEW ──────────────────────────── */}
                                            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                <button
                                                    onClick={handleGenerateLink}
                                                    disabled={isSaving}
                                                    style={{
                                                        width: '100%', padding: '14px',
                                                        borderRadius: 16,
                                                        background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                                                        border: 'none', color: '#fff',
                                                        fontSize: 13, fontBlack: 900,
                                                        cursor: 'pointer',
                                                        boxShadow: '0 8px 24px rgba(244,63,94,0.3)',
                                                        display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', gap: 10,
                                                        letterSpacing: '0.08em',
                                                        opacity: isSaving ? 0.7 : 1,
                                                        textTransform: 'uppercase'
                                                    }}
                                                >
                                                    {isSaving ? "A CRIAR..." : <>🔗 GERAR & ABRIR LINK</>}
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
                                                                className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-white"
                                                            >
                                                                Fechar
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