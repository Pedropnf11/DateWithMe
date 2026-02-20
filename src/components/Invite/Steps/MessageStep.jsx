import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function MessageStep({ step, onAnswer }) {
    return (
        <div className="space-y-8 w-full py-4">
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2"
                >
                    <span className="text-3xl">✨</span>
                </motion.div>

                <h2 className="text-3xl font-black text-gray-800 leading-tight uppercase tracking-tighter italic">
                    {step.title}
                </h2>

                {step.subtitle && (
                    <p className="text-gray-500 font-medium text-lg leading-relaxed italic">
                        "{step.subtitle}"
                    </p>
                )}
            </div>

            {step.gif && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
                >
                    <img src={step.gif} className="w-full h-48 object-cover" alt="Message GIF" />
                </motion.div>
            )}

            <button
                onClick={() => onAnswer(step.id, true)}
                className="w-full py-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-[2rem] shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm"
            >
                CONTINUAR <ChevronRight size={22} strokeWidth={4} />
            </button>
        </div>
    );
}
