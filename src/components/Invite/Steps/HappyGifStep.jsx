import { ChevronRight } from 'lucide-react';

export default function HappyGifStep({ step, onAnswer }) {
    return (
        <div className="space-y-6 w-full text-center">
            {step.gif && (
                <img src={step.gif} alt="Happy!" className="w-full h-64 object-cover rounded-3xl shadow-lg mx-auto" />
            )}
            <h2 className="text-2xl font-black text-pink-500">YAY! 🎉</h2>
            <button
                onClick={() => onAnswer(step.id, 'seen')}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
                Continuar <ChevronRight size={20} className="inline" />
            </button>
        </div>
    );
}
