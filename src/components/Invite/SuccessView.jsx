import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SuccessView({ onResponse, isSubmitting, creatorNote }) {
    const [displayText, setDisplayText] = useState('');
    const fullText = creatorNote || "Mal posso esperar para te ver! 💕";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) {
                clearInterval(interval);
                // Auto-submit after typewriter finishes
                setTimeout(() => {
                    onResponse(true);
                }, 1500);
            }
        }, 60);
        return () => clearInterval(interval);
    }, [fullText, onResponse]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center p-6 text-white font-sans overflow-hidden">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] text-center max-w-md w-full border border-white/20 shadow-2xl relative"
            >
                <motion.div
                    animate={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-8"
                >
                    <PartyPopper size={80} className="mx-auto text-yellow-300" />
                </motion.div>

                <h1 className="text-4xl font-black mb-10 tracking-tight uppercase">É um Date! ✨</h1>

                <div className="bg-black/10 p-8 rounded-[2rem] mb-8 border border-white/5 min-h-[140px] flex items-center justify-center shadow-inner">
                    <p className="text-xl font-medium leading-relaxed italic">
                        "{displayText}"
                        <span className="inline-block w-2 h-6 bg-pink-400 ml-1 animate-pulse align-middle" />
                    </p>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1 }}
                    className="text-[10px] font-black uppercase tracking-[0.3em]"
                >
                    A confirmar o plano...
                </motion.p>
            </motion.div>
        </div>
    );
}
