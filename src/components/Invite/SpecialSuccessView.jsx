import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function SpecialSuccessView({ creatorNote }) {
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

    return (
        <div className="min-h-screen bg-[#0f0a12] relative flex items-center justify-center p-6 text-white font-sans overflow-hidden w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/40 via-purple-900/20 to-rose-900/40 opacity-60" />
            <div className="absolute inset-0">
                <FloatingHeart delay={0} x={10} y={80} size={20} />
                <FloatingHeart delay={1.5} x={85} y={15} size={32} />
                <FloatingHeart delay={3} x={25} y={30} size={15} />
                <FloatingHeart delay={0.5} x={70} y={75} size={24} />
                <FloatingHeart delay={2} x={5} y={40} size={18} />
            </div>

            <div className="w-full max-w-md relative z-10 space-y-8">
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] p-10 rounded-[4rem] text-center border relative overflow-hidden group"
                >
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-[80px]" />
                    <h1 className="text-4xl italic bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent font-black mb-8 tracking-tighter uppercase">
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

                <div className="space-y-4 text-center">
                    <div className="flex justify-center gap-6 opacity-30">
                        <Sparkles size={20} className="text-pink-400 animate-pulse" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Star size={20} fill="currentColor" className="text-pink-400" />
                        </motion.div>
                        <Sparkles size={20} className="text-pink-400 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: typewriterDone ? 0.8 : 0 }}
                            className="text-[12px] font-black italic uppercase tracking-[0.4em] bg-gradient-to-r from-pink-200 via-white to-pink-200 bg-clip-text text-transparent"
                        >
                            Prometo que vai ser inesquecível ✨
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: typewriterDone ? 0.2 : 0 }}
                            className="text-[8px] font-black uppercase tracking-[0.6em] text-pink-200/50"
                        >
                            Exclusivamente no DatewithMe
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    );
}
