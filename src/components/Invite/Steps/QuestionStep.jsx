import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mensagens fofas para o botão bloqueado (Quebra-Gelo)
const CUTE_BLOCK_MESSAGES = [
    "Mas pqqq 🥺",
    "Não é opção!!",
    "Última tentativa, é mesmo um não? 🥺",
];

const RUNAWAY_MESSAGES = [
    "Onde vais? 😂",
    "Não fujas! ✨",
    "Prometo que vai ser bom! 🥺",
    "Ainda aqui? �",
    "És teimosa/o! ❤️",
];

export default function QuestionStep({ step, onAnswer, templateId }) {
    const [noClicks, setNoClicks] = useState(0);
    const [noPos, setNoPos] = useState({ x: null, y: null });
    const [toastMsg, setToastMsg] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Quebra-Gelo → block_cute | Especial → runaway / growing_yes
    const behavior = step.config?.noButtonBehavior ?? 'block_cute';
    const isRunaway = behavior === 'runaway' || behavior === 'growing_yes';

    // Icebreaker: desbloqueia após 3 cliques
    const isBlocked = (behavior === 'block_cute' || behavior === 'none') && noClicks < 3;

    const unlockAfter = step.config?.noUnlocksAfter ?? 0;
    const isNoLocked = unlockAfter > 0 && noClicks < unlockAfter;
    const yesScale = isRunaway ? 1 + noClicks * 0.1 : 1;

    // ── Comportamento bloqueado com toast fofo ───────────────────
    const handleBlockedNo = () => {
        const msg = CUTE_BLOCK_MESSAGES[Math.min(noClicks, CUTE_BLOCK_MESSAGES.length - 1)];
        setToastMsg(msg);
        setShowToast(true);
        setNoClicks(p => p + 1);
        setTimeout(() => setShowToast(false), 2000);
    };

    // ── Comportamento fugitivo ───────────────────────────────────
    const moveNo = () => {
        setNoPos({
            x: Math.random() * 70 + 5,
            y: Math.random() * 70 + 5,
        });
        setNoClicks(p => p + 1);
    };

    const handleNo = () => {
        if (isBlocked) {
            handleBlockedNo();
        } else {
            // runaway: se desbloqueado submete, senão foge
            if (!isNoLocked) {
                onAnswer(step.id, 'no');
            } else {
                moveNo();
            }
        }
    };

    return (
        <div className="space-y-8 w-full text-center relative min-h-[400px] flex flex-col items-center justify-center">

            {/* Toast fofo — só para blocked */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        key={toastMsg + noClicks}
                        initial={{ opacity: 0, y: -16, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-pink-200 shadow-xl rounded-2xl px-5 py-3 text-pink-500 font-black text-sm whitespace-nowrap"
                    >
                        {toastMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {step.gif && (
                <img
                    src={step.gif}
                    alt="Vibe"
                    className="w-full h-56 object-contain rounded-3xl shadow-lg"
                />
            )}

            <h2 className="text-3xl font-black text-gray-800 leading-tight px-2">
                {step.title}
            </h2>

            <div className="flex gap-4 items-center justify-center w-full max-w-sm mx-auto relative h-20">

                {/* ── SIM ── */}
                <motion.button
                    onClick={() => onAnswer(step.id, 'yes')}
                    animate={{ scale: Math.min(yesScale, 2.5) }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-shadow z-10"
                >
                    SIMMMMM! 💕
                </motion.button>

                {/* ── NÃO (blocked) ── */}
                {isBlocked ? (
                    <motion.button
                        onClick={handleBlockedNo}
                        whileTap={{ scale: 0.92 }}
                        animate={showToast ? { x: [0, -4, 4, -4, 0] } : {}}
                        transition={{ duration: 0.3 }}
                        className="px-6 py-4 rounded-2xl font-bold text-sm bg-white border-2 border-gray-100 text-gray-300 cursor-not-allowed select-none shrink-0"
                    >
                        Não...
                    </motion.button>
                ) : (behavior === 'block_cute' || behavior === 'none') && (
                    <motion.button
                        onClick={() => onAnswer(step.id, 'no')}
                        whileTap={{ scale: 0.92 }}
                        className="px-6 py-4 rounded-2xl font-bold text-sm bg-white border-2 border-gray-100 text-gray-400 hover:text-red-400 transition-colors shrink-0"
                    >
                        Não...
                    </motion.button>
                )}

                {/* ── NÃO (runaway) ── */}
                {isRunaway && (
                    <motion.button
                        onMouseEnter={moveNo}
                        onClick={handleNo}
                        style={noClicks > 0 ? {
                            position: 'fixed',
                            left: `${noPos.x}%`,
                            top: `${noPos.y}%`,
                            zIndex: 100,
                        } : {}}
                        animate={noClicks > 0 ? { x: 0, y: 0 } : {}}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all shrink-0
                            ${noClicks === 0
                                ? 'bg-white border-2 border-gray-100 text-gray-400'
                                : 'bg-white border-2 border-pink-100 text-pink-400 shadow-xl'
                            }`}
                    >
                        {noClicks === 0 ? 'Não...' : RUNAWAY_MESSAGES[(noClicks - 1) % RUNAWAY_MESSAGES.length]}
                    </motion.button>
                )}
            </div>


            {isRunaway && (
                <p className="text-[10px] text-pink-300 font-bold uppercase tracking-widest animate-pulse">
                    (O botão 'Não' está a fugir! 😂)
                </p>
            )}
        </div>
    );
}
