// ── Card 2: Forca do Local ──────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_ERRORS = 6;

const normalize = (str) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

export default function WordGuess({ location, onDone }) {
  const word = normalize(location || 'LOCAL');
  const letters = word.split('');
  const uniqueLetters = [...new Set(letters.filter(l => l !== ' ' && l !== '-'))];

  const [guessed, setGuessed] = useState([]);
  const [won, setWon] = useState(false);
  const [errors, setErrors] = useState(0);

  const correctGuesses = guessed.filter(l => uniqueLetters.includes(l));
  const wrongGuesses = guessed.filter(l => !uniqueLetters.includes(l));
  const isWon = uniqueLetters.every(l => guessed.includes(l));
  const isLost = wrongGuesses.length >= MAX_ERRORS;

  useEffect(() => {
    if (isWon && !won) {
      setWon(true);
      setTimeout(() => onDone?.(), 1800);
    }
  }, [isWon]);

  const guess = (letter) => {
    if (guessed.includes(letter) || isWon || isLost) return;
    const newGuessed = [...guessed, letter];
    setGuessed(newGuessed);
    if (!uniqueLetters.includes(letter)) {
      setErrors(e => e + 1);
    }
  };

  const lives = MAX_ERRORS - wrongGuesses.length;
  const heartsDisplay = Array.from({ length: MAX_ERRORS }, (_, i) => i < lives ? '❤️' : '💔');

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center space-y-1">
        <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">Card 2 de 4</p>
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">O Local Misterioso 📍</h2>
        <p className="text-xs text-gray-400 font-bold">Descobre letra a letra onde vais ser surpreendida!</p>
      </div>

      {/* Vidas */}
      <div className="flex gap-1 text-xl">
        {heartsDisplay.map((h, i) => (
          <motion.span
            key={i}
            initial={h === '💔' ? { scale: 1.4 } : {}}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            {h}
          </motion.span>
        ))}
      </div>

      {/* Palavra */}
      <div className="flex gap-2 flex-wrap justify-center px-4">
        {letters.map((letter, i) => {
          if (letter === ' ') return <div key={i} className="w-4" />;
          if (letter === '-') return <span key={i} className="text-2xl font-black text-gray-300 self-end pb-1">-</span>;
          const isRevealed = guessed.includes(normalize(letter));
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <AnimatePresence>
                {isRevealed && (
                  <motion.span
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black text-gray-800"
                  >
                    {letter}
                  </motion.span>
                )}
              </AnimatePresence>
              {!isRevealed && <span className="text-2xl font-black text-transparent">?</span>}
              <div className="w-7 h-0.5 bg-pink-300 rounded" />
            </div>
          );
        })}
      </div>

      {/* Estado */}
      {isWon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-50 border-2 border-green-200 rounded-2xl px-6 py-3 text-center"
        >
          <p className="text-sm font-black text-green-600 uppercase tracking-widest">Acertaste! 🎉</p>
          <p className="text-xs text-green-400 font-bold">Mas ainda não sabes tudo... 😏</p>
        </motion.div>
      )}

      {isLost && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-rose-50 border-2 border-rose-200 rounded-2xl px-6 py-3 text-center"
        >
          <p className="text-sm font-black text-rose-600 uppercase tracking-widest">Era: {location} 😅</p>
          <p className="text-xs text-rose-400 font-bold">Quase! Mas isto é só o começo...</p>
        </motion.div>
      )}

      {/* Teclado */}
      {!isWon && !isLost && (
        <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
          {ALPHABET.map(l => {
            const isGuessed = guessed.includes(l);
            const isCorrect = isGuessed && uniqueLetters.includes(l);
            const isWrong = isGuessed && !uniqueLetters.includes(l);
            return (
              <motion.button
                key={l}
                onClick={() => guess(l)}
                whileTap={{ scale: 0.85 }}
                disabled={isGuessed}
                className={`w-9 h-9 rounded-xl text-xs font-black transition-all border-2
                  ${isCorrect ? 'bg-green-100 border-green-300 text-green-600' :
                    isWrong ? 'bg-gray-100 border-gray-200 text-gray-300' :
                    'bg-white border-pink-100 text-gray-700 hover:border-pink-400 hover:bg-pink-50'
                  }`}
              >
                {l}
              </motion.button>
            );
          })}
        </div>
      )}

      {(isLost) && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => onDone?.()}
          className="w-full max-w-xs py-4 bg-pink-500 text-white font-black text-sm uppercase tracking-widest rounded-[2rem] shadow-lg shadow-pink-200"
        >
          Continuar 💌
        </motion.button>
      )}
    </div>
  );
}
