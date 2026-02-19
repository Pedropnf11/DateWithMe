import { useState } from 'react';

export default function QuestionStep({ step, onAnswer }) {
    const [noClicks, setNoClicks] = useState(0);
    const [noPos, setNoPos] = useState({ x: null, y: null });
    const unlockAfter = step.config?.noUnlocksAfter ?? 0;
    const isNoLocked = unlockAfter > 0 && noClicks < unlockAfter;
    const yesScale = 1 + noClicks * 0.1; // 10% increase

    const noMessages = [
        "Tens a certeza? 🥺",
        "Pensa melhor...",
        "Mesmo a sério? 😭",
        "Última oportunidade...",
        `Faltam ${unlockAfter - noClicks}...`,
        "Pronto... 😔",
    ];
    const noMsg = noMessages[Math.min(noClicks, noMessages.length - 1)];

    const moveNo = () => {
        if (!isNoLocked) {
            setNoPos({
                x: Math.random() * 70 + 5,
                y: Math.random() * 70 + 5,
            });
            setNoClicks(prev => prev + 1);
        }
    };

    const handleNo = () => {
        if (!isNoLocked) submitNo();
        else moveNo();
    };

    const submitNo = () => {
        onAnswer(step.id, 'no');
    };

    return (
        <div className="space-y-8 w-full text-center relative min-h-[400px] flex flex-col items-center justify-center">
            {step.gif && (
                <img src={step.gif} alt="Vibe" className="w-full h-64 object-contain rounded-3xl shadow-lg mb-4" />
            )}
            <h2 className="text-3xl font-black text-gray-800 leading-tight mb-4">{step.title}</h2>

            <div className="flex gap-4 items-center justify-center w-full max-w-sm mx-auto relative h-20">
                {/* YES */}
                <button
                    onClick={() => onAnswer(step.id, 'yes')}
                    style={{ transform: `scale(${Math.min(yesScale, 3)})` }}
                    className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all origin-center z-10"
                >
                    SIMMMMM! 💕
                </button>

                {/* NO */}
                <button
                    onMouseEnter={moveNo}
                    onClick={handleNo}
                    style={noClicks > 0 ? {
                        position: 'fixed',
                        left: `${noPos.x}%`,
                        top: `${noPos.y}%`,
                        zIndex: 100,
                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        opacity: isNoLocked ? 0.7 : 1,
                    } : {}}
                    className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all shrink-0
                        ${noClicks === 0
                            ? 'bg-white border-2 border-gray-100 text-gray-400 hover:text-gray-600'
                            : 'bg-white border-2 border-pink-100 text-pink-400 shadow-xl'
                        }
                    `}
                >
                    {noClicks === 0 ? 'Não...' : noMsg}
                </button>
            </div>

            <p className="text-[10px] text-pink-300 font-bold uppercase tracking-widest mt-4 animate-pulse">
                (O botão 'Não' está a fugir! 😂)
            </p>
        </div>
    );
}
