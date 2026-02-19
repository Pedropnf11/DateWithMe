import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function RatingStep({ step, onAnswer }) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const max = step.config?.maxStars || 5;

    return (
        <div className="space-y-4 w-full">
            <h2 className="text-2xl font-black text-gray-800 text-center">{step.title}</h2>

            <div className="space-y-6 text-center">
                <div className="flex justify-center gap-2">
                    {Array.from({ length: max }, (_, i) => i + 1).map(i => (
                        <button
                            key={i}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => setRating(i)}
                            className="transition-transform hover:scale-110"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                                fill={(hovered || rating) >= i ? '#FBBF24' : 'none'}
                                stroke={(hovered || rating) >= i ? '#FBBF24' : '#D1D5DB'}
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </button>
                    ))}
                </div>
                {step.gif && (
                    <img src={step.gif} alt="vibe" className="mx-auto h-48 rounded-2xl shadow-lg object-cover max-w-full" />
                )}
                {rating > 0 && (
                    <p className="text-pink-500 font-bold text-lg">{rating} / {max} ⭐</p>
                )}
                <button
                    disabled={!rating}
                    onClick={() => onAnswer(step.id, rating)}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Enviar Avaliação <ChevronRight size={20} className="inline" />
                </button>
            </div>
        </div>
    );
}
