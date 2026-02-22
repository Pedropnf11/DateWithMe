import { useState } from 'react';
import { GripVertical, ChevronRight } from 'lucide-react';
import { Reorder } from 'framer-motion';

export default function RankingStep({ step, onAnswer }) {
    const options = step.options || [];
    const [ranked, setRanked] = useState(
        options.map((opt, i) => ({ ...opt, _id: i }))
    );

    return (
        <div className="space-y-4 w-full">
            <h2 className="text-2xl font-black text-gray-800 text-center">{step.title}</h2>
            {step.subtitle && (
                <p className="text-sm text-gray-400 text-center">{step.subtitle}</p>
            )}

            <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                Arrasta para ordenar da tua favorita para a menos favorita 👆
            </p>

            <Reorder.Group axis="y" values={ranked} onReorder={setRanked} className="space-y-3">
                {ranked.map((opt, idx) => (
                    <Reorder.Item
                        key={opt._id}
                        value={opt}
                        className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-3 cursor-grab active:cursor-grabbing active:shadow-lg active:border-pink-300 select-none"
                    >
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0">
                            {idx + 1}
                        </div>
                        {opt.image && (
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                <img src={opt.image} className="w-full h-full object-cover" alt={opt.label} />
                            </div>
                        )}
                        <span className="flex-1 font-bold text-gray-700 text-base">{opt.label}</span>
                        <GripVertical size={20} className="text-gray-300 shrink-0" />
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <button
                onClick={() => onAnswer(step.id, ranked.map(o => o.label))}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
                Confirmar Ordenação <ChevronRight size={20} />
            </button>
        </div>
    );
}
