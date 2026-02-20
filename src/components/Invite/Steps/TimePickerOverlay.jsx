import { motion, AnimatePresence } from 'framer-motion';

export default function TimePickerOverlay({ value, onChange, isOpen, onClose }) {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

    const [currentH, currentM] = (value || '20:00').split(':');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="fixed inset-0 z-[100] bg-black/5 backdrop-blur-[1px]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[2rem] shadow-2xl border border-pink-100 p-4 z-[110] flex flex-col gap-4 min-w-[200px]"
                    >
                        <div className="flex gap-4 h-48">
                            <div className="flex-1 overflow-y-auto px-1 custom-scrollbar">
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 text-center sticky top-0 bg-white py-1">Hora</p>
                                <div className="flex flex-col gap-1">
                                    {hours.map(h => (
                                        <button
                                            key={h}
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onChange(`${h}:${currentM}`); }}
                                            className={`py-2 rounded-xl text-sm font-black transition-all ${currentH === h ? 'bg-pink-500 text-white shadow-md' : 'hover:bg-pink-50 text-gray-600'}`}
                                        >
                                            {h}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto px-1 custom-scrollbar">
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 text-center sticky top-0 bg-white py-1">Min</p>
                                <div className="flex flex-col gap-1">
                                    {minutes.map(m => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onChange(`${currentH}:${m}`); }}
                                            className={`py-2 rounded-xl text-sm font-black transition-all ${currentM === m ? 'bg-pink-500 text-white shadow-md' : 'hover:bg-pink-50 text-gray-600'}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="w-full py-2 bg-pink-50 text-pink-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-pink-100 transition-colors"
                        >
                            Confirmar
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
