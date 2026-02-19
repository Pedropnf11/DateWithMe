import { useState, useRef } from 'react';
import { GripVertical, ChevronRight } from 'lucide-react';

export default function RankingStep({ step, onAnswer }) {
    const options = step.options || [];
    const [ranked, setRanked] = useState(
        options.map((opt, i) => ({ ...opt, _id: i }))
    );
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    const handleDragStart = (idx) => { dragItem.current = idx; };
    const handleDragEnter = (idx) => { dragOverItem.current = idx; };
    const handleDragEnd = () => {
        const from = dragItem.current;
        const to = dragOverItem.current;
        if (from === null || to === null || from === to) return;
        const next = [...ranked];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        setRanked(next);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    return (
        <div className="space-y-4 w-full">
            <h2 className="text-2xl font-black text-gray-800 text-center">{step.title}</h2>
            {step.subtitle && (
                <p className="text-sm text-gray-400 text-center">{step.subtitle}</p>
            )}

            <p className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                Arrasta para ordenar da tua favorita para a menos favorita 👆
            </p>
            <div className="space-y-3">
                {ranked.map((opt, idx) => (
                    <div
                        key={opt._id}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragEnter={() => handleDragEnter(idx)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-3 cursor-grab active:cursor-grabbing active:shadow-lg active:border-pink-300 transition-all select-none"
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
                    </div>
                ))}
            </div>
            <button
                onClick={() => onAnswer(step.id, ranked.map(o => o.label))}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
                Confirmar Ordenação <ChevronRight size={20} />
            </button>
        </div>
    );
}
