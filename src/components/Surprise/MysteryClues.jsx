// ── Card 3: Pistas Misteriosas ──────────────────────────────────────────────
// Ela revela as pistas uma a uma — mas nunca consegue ter a certeza do que vai fazer!
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

const MYSTERY_PHRASES = [
  'Será que é cinema... ou jantar? 🤔',
  'Talvez seja algo ao ar livre... ou não? 🌳',
  'Uma coisa é certa: vais adorar! 💕',
  'Mas afinal o que é?! Nunca vais saber até lá chegares 🫣',
];

export default function MysteryClues({ clues = [], onDone }) {
  const [revealed, setRevealed] = useState([]);
  const [showMystery, setShowMystery] = useState(false);

  const revealClue = (idx) => {
    if (revealed.includes(idx)) return;
    const newRevealed = [...revealed, idx];
    setRevealed(newRevealed);
    if (newRevealed.length === clues.length) {
      setTimeout(() => setShowMystery(true), 600);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center space-y-1">
        <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">Card 3 de 4</p>
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">As Pistas 🔍</h2>
        <p className="text-xs text-gray-400 font-bold">Toca em cada pista para revelar... se tiveres coragem!</p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        {clues.map((clue, idx) => {
          const isRevealed = revealed.includes(idx);
          return (
            <motion.button
              key={idx}
              onClick={() => revealClue(idx)}
              whileTap={{ scale: 0.97 }}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300
                ${isRevealed
                  ? 'bg-pink-50 border-pink-200 cursor-default'
                  : 'bg-white border-gray-100 hover:border-pink-200 cursor-pointer'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                  ${isRevealed ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {isRevealed ? <Unlock size={16} /> : <Lock size={16} />}
                </div>
                <AnimatePresence mode="wait">
                  {isRevealed ? (
                    <motion.p
                      key="revealed"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm font-bold text-gray-700 flex-1"
                    >
                      {clue}
                    </motion.p>
                  ) : (
                    <motion.p key="hidden" className="text-xs font-black text-gray-300 uppercase tracking-widest flex-1">
                      Pista {idx + 1} — Toca para revelar
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Contador */}
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        {revealed.length} / {clues.length} pistas reveladas
      </p>

      {/* Mensagem de ambiguidade final */}
      <AnimatePresence>
        {showMystery && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-xs bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-pink-200 rounded-[1.5rem] p-5 text-center space-y-2"
          >
            <p className="text-2xl">🫣</p>
            <p className="text-sm font-black text-rose-600 leading-snug">
              Então... já sabes o que vamos fazer?
            </p>
            <p className="text-xs text-gray-400 font-bold italic leading-relaxed">
              Cinema? Jantar? Passeio? Talvez os três?<br/>
              Nunca vais saber até lá chegares... e é esse o plano! 😈
            </p>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onDone?.()}
              className="w-full mt-3 py-3.5 bg-pink-500 text-white font-black text-xs uppercase tracking-widest rounded-[1.5rem] shadow-lg shadow-pink-200"
            >
              Última Pista 💌
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
