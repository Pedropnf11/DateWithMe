import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function TextInputStep({ step, onAnswer }) {
    const [text, setText] = useState('');
    const config = step.config || {};
    const placeholder = config.placeholder || 'Escreve aqui...';
    const isOptional = config.optional;
    const maxLength = config.maxLength || 500;

    const handleConfirm = () => {
        if (!isOptional && !text.trim()) return;
        onAnswer(step.id, text);
    };

    return (
        <div className="space-y-6 w-full">
            <div className="text-center">
                <h2 className="text-2xl font-black text-gray-800">{step.title}</h2>
                {step.subtitle && <p className="text-sm text-gray-400 mt-2">{step.subtitle}</p>}
            </div>

            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, maxLength))}
                    placeholder={placeholder}
                    className="w-full h-40 p-4 bg-white border-2 border-pink-100 rounded-2xl focus:border-pink-500 focus:outline-none transition-all text-gray-700 resize-none font-medium text-lg leading-relaxed shadow-inner"
                />
                <div className="absolute bottom-4 right-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    {text.length} / {maxLength}
                </div>
            </div>

            <button
                disabled={!isOptional && !text.trim()}
                onClick={handleConfirm}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
                Confirmar <ChevronRight size={20} className="inline ml-1" />
            </button>
        </div>
    );
}
