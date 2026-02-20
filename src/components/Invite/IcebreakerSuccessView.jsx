import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function IcebreakerSuccessView({ creatorNote }) {
    return (
        <div className="min-h-screen bg-pink-50 relative flex items-center justify-center p-6 text-gray-800 font-sans overflow-hidden w-full">
            {/* Soft animated background elements */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-pink-200 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-rose-200 rounded-full blur-[120px]"
            />

            <div className="w-full max-w-md relative z-10 space-y-12">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white p-10 rounded-[3rem] text-center border-4 border-white shadow-2xl relative overflow-hidden"
                >


                    <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase text-gray-900 leading-none">
                        Tudo pronto!
                    </h1>

                    <p className="text-pink-500 font-black text-[10px] uppercase tracking-widest mb-8">
                        Agora basta esperar até ao dia
                    </p>
                </motion.div>

                <div className="space-y-3 text-center">
                    <div className="flex justify-center gap-4 opacity-30">
                        <Heart size={16} fill="currentColor" className="text-pink-400" />
                        <Sparkles size={16} className="text-pink-400" />
                        <Heart size={16} fill="currentColor" className="text-pink-400" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                        Obrigado por aceitares, prometo não desiludir
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Feito com DatewithMe
                    </p>
                </div>
            </div>
        </div>
    );
}
