import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Heart, Star, Sparkles, Calendar, Clock, Utensils, Coffee, MapPin, Gauge } from 'lucide-react';
import { useEffect, useState } from 'react';

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatDate(dateStr) {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const date = new Date(y, m - 1, d);
    return `${weekdays[date.getDay()]}, ${d} ${MONTH_NAMES[m - 1]}`;
}

function MiniCard({ emoji, label, value, icon: Icon, delay = 0 }) {
    if (!value) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2 + delay, type: 'spring', stiffness: 200, damping: 20 }}
            className="group flex flex-col items-center gap-2 bg-white/10 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-lg hover:bg-white/15 transition-all"
        >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center shadow-md shadow-pink-900/20 mb-1">
                {Icon ? <Icon size={20} className="text-white" /> : <span className="text-xl">{emoji}</span>}
            </div>
            <div className="text-center">
                <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">{label}</p>
                <p className="text-[11px] font-black text-white leading-tight">{value}</p>
            </div>
        </motion.div>
    );
}

const FloatingHeart = ({ delay = 0, x = 0, y = 0, size = 24 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0, 0.4, 0],
            scale: [0.5, 1, 0.5],
            y: y - 100,
            x: x + (Math.random() * 40 - 20)
        }}
        transition={{
            duration: 4,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
        }}
        style={{ position: 'absolute', left: `${x}%`, top: `${y}%` }}
        className="text-pink-300 pointer-events-none"
    >
        <Heart size={size} fill="currentColor" />
    </motion.div>
);

export default function SuccessView({ onResponse, isSubmitting, creatorNote, answers }) {
    const [displayText, setDisplayText] = useState('');
    const [typewriterDone, setTypewriterDone] = useState(false);
    const fullText = creatorNote || "Mal posso esperar para te ver! 💕";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) {
                clearInterval(interval);
                setTypewriterDone(true);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [fullText]);

    const dateAnswer = answers?.['step_date'];
    const foodAnswer = answers?.['step_food'] || answers?.['step_lunch'];
    const dinnerAnswer = answers?.['step_dinner'];
    const actAnswer = answers?.['step_activity'] || answers?.['step_after_activity'];
    const snackAnswer = answers?.['step_snack'];
    const nightAnswer = answers?.['step_night_out'];
    const ratingAnswer = answers?.['step_rating'];

    const firstOf = (arr) => (Array.isArray(arr) ? arr[0] : null);

    const dateStr = dateAnswer?.date;
    const startTime = dateAnswer?.startTime;
    const endTime = dateAnswer?.endTime;
    const food = firstOf(foodAnswer) || firstOf(dinnerAnswer);
    const act = firstOf(actAnswer);
    const snack = firstOf(snackAnswer);
    const night = firstOf(nightAnswer);
    const stars = ratingAnswer ? '⭐'.repeat(ratingAnswer) : null;

    return (
        <div className="min-h-screen bg-[#0f0a12] relative flex items-center justify-center p-6 text-white font-sans overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/40 via-purple-900/20 to-rose-900/40 opacity-60" />
            <div className="absolute inset-0">
                <FloatingHeart delay={0} x={10} y={80} size={20} />
                <FloatingHeart delay={1.5} x={85} y={15} size={32} />
                <FloatingHeart delay={3} x={25} y={30} size={15} />
                <FloatingHeart delay={0.5} x={70} y={75} size={24} />
                <FloatingHeart delay={2} x={5} y={40} size={18} />
            </div>

            <div className="w-full max-w-md relative z-10 space-y-8">
                {/* Main Success Card */}
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="bg-white/5 backdrop-blur-2xl p-10 rounded-[4rem] text-center border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                >
                    {/* Interior glow */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-[80px]" />



                    <h1 className="text-4xl font-black mb-8 tracking-tighter uppercase italic bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
                        Calma que ainda falta uma coisa!
                    </h1>

                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-inner relative overflow-hidden group-hover:bg-white/10 transition-colors">
                        <div className="absolute top-2 left-4 text-pink-500/30 font-serif text-6xl leading-none">“</div>
                        <p className="text-xl font-bold leading-relaxed italic relative z-10 text-pink-50/90">
                            {displayText}
                            {!typewriterDone && <span className="inline-block w-1.5 h-6 bg-pink-400 ml-1 animate-pulse align-middle" />}
                        </p>
                    </div>
                </motion.div>



                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: typewriterDone ? 0.3 : 0 }}
                    transition={{ delay: 2 }}
                    className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-pink-200"
                >
                    Obrigado por aceitares 💕

                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: typewriterDone ? 0.3 : 0 }}
                    transition={{ delay: 2 }}
                    className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-pink-200"
                >
                    Feito com DatewithMe
                </motion.p>
            </div>
        </div>
    );
}
