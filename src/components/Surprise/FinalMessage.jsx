import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
export default function FinalMessage({ message, onAccept, isSubmitting, selectedDate }) {
  const [accepted, setAccepted] = useState(false);
  const [noClicks, setNoClicks] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const cuteMessages = [
    "Mas pqqq 🥺",
    "Não é opção!!",
    "Tenta outra vez 😂",
    "Isso não existe aqui",
    "Sério?? 😭",
    "O botão diz que não 💅",
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '???';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' });
  };

  const handleAccept = () => {
    setAccepted(true);
    confetti({
      particleCount: 180,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#FF69B4', '#FFD700', '#FF1493', '#fff'],
    });
    onAccept?.();
  };

  const handleNo = () => {
    const msg = cuteMessages[noClicks % cuteMessages.length];
    setToastMsg(msg);
    setShowToast(true);
    setNoClicks(prev => prev + 1);
    setTimeout(() => setShowToast(false), 2000);
  };

  const yesScale = 1 + noClicks * 0.15;

  return (
    <div className="flex flex-col items-center gap-6 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-pink-200 shadow-xl rounded-2xl px-5 py-3 text-pink-500 font-black text-xs whitespace-nowrap"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center space-y-1">
        <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">Card 4 de 4</p>
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic">A Mensagem 💌</h2>
      </div>

      {!accepted ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs space-y-5"
        >
          {/* Carta */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-pink-200 rounded-[2.5rem] p-8 text-center shadow-inner relative overflow-hidden">
            {/* Decoração */}
            <div className="absolute top-3 left-3 text-3xl opacity-20">💕</div>
            <div className="absolute bottom-3 right-3 text-3xl opacity-20">💕</div>


            <p className="text-base font-bold text-gray-700 leading-relaxed italic">
              &quot;{message || 'Mal posso esperar para te ver! 💕'}&quot;
            </p>
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              animate={{ scale: Math.min(yesScale, 2.5) }}
              onClick={handleAccept}
              disabled={isSubmitting}
              className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[2rem] shadow-xl shadow-pink-200 disabled:opacity-70 z-10"
            >
              {isSubmitting ? '...' : 'Estou dentro! 🙋‍♀️'}
            </motion.button>

            <motion.button
              onClick={handleNo}
              whileTap={{ scale: 0.92 }}
              animate={showToast ? { x: [0, -4, 4, -4, 0] } : {}}
              className="w-full py-3 rounded-2xl font-bold text-xs bg-white border-2 border-gray-100 text-gray-300 hover:text-pink-300 hover:border-pink-100 transition-colors"
            >
              Não...
            </motion.button>
          </div>

          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">
            Prepara-te para o melhor date de sempre 🌟<br />
            (Dica: o botão "Não" é só para enfeite 😏)
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-full max-w-xs bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-[2rem] p-8 text-center space-y-3"
        >
          <p className="text-5xl">🎉</p>
          <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">É OFICIAL!</h3>
          <p className="text-sm text-gray-500 font-bold">
            A tua resposta foi registada para o dia<br />
            <span className="text-pink-600 font-black">{formatDate(selectedDate?.date)} às {selectedDate?.time}</span>.<br />
            Agora só falta aparecer! 💕
          </p>
          <p className="text-xs text-gray-400 italic">
            Pst... ele já sabe que disseste sim 😏
          </p>
        </motion.div>
      )}
    </div>
  );
}
