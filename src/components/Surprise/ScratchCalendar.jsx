// ── Card 1: Calendário Raspável ─────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function ScratchCalendar({ dateOptions = [], onDone }) {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [percent, setPercent] = useState(0);
  const [selected, setSelected] = useState(null);
  const isDrawing = useRef(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return { day: '??', month: '???', weekday: '????' };
    const d = new Date(dateStr + 'T00:00:00');
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: months[d.getMonth()],
      weekday: weekdays[d.getDay()],
      year: d.getFullYear()
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const W = canvas.width;
    const H = canvas.height;

    // Fundo da raspadinha com padrão ou gradiente
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#f9a8d4');
    grad.addColorStop(0.5, '#fb7185');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Texto de instrução
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ RASPA PARA REVELAR ✨', W / 2, H / 2 - 10);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('as datas da nossa aventura', W / 2, H / 2 + 15);
  }, []);

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) cleared++;
    }
    const pct = Math.round((cleared / (canvas.width * canvas.height)) * 100);
    setPercent(pct);
    if (pct > 60 && !revealed) {
      setRevealed(true);
    }
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center space-y-1">
        <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">Card 1 de 4</p>
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic leading-none">A Data Secreta 📅</h2>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tight">Raspa para ver quando é que ele está livre! 😉</p>
      </div>

      <div className="relative w-full max-w-xs aspect-[5/4]">
        {/* Opções por baixo */}
        <div
          className="absolute inset-0 bg-white rounded-[2.5rem] border-2 border-pink-50 shadow-inner p-4 overflow-hidden flex flex-col items-center justify-center transition-all duration-500"
          style={{
            filter: `blur(${Math.max(0, 20 - percent * 0.4)}px)`,
            opacity: Math.min(1, percent / 40 + 0.1)
          }}
        >
          <AnimatePresence>
            {(revealed || percent > 10) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full flex flex-col transition-all"
              >
                <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest text-center mb-3">Escolhe o teu dia: ❤️</p>
                <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                  {dateOptions.map((opt, idx) => {
                    const { day, month, weekday } = formatDate(opt.date);
                    const isSel = selected === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelected(idx)}
                        className={`w-full p-3 rounded-2xl border-2 transition-all flex items-center justify-between
                          ${isSel ? 'bg-pink-500 border-pink-600 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-pink-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center
                            ${isSel ? 'bg-white text-pink-600' : 'bg-pink-100 text-pink-500'}`}>
                            <span className="text-[8px] font-black uppercase leading-none">{month}</span>
                            <span className="text-sm font-black leading-none">{day}</span>
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-tight leading-none">{weekday}</p>
                            <p className={`text-[11px] font-bold ${isSel ? 'text-pink-100' : 'text-gray-400'}`}> às {opt.time || '??:??'}</p>
                          </div>
                        </div>
                        {isSel && <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-inner"><CheckCircle2 size={14} className="text-pink-600" /></div>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Canvas por cima */}
        {!selected && (
          <canvas
            ref={canvasRef}
            width={300}
            height={240}
            className={`absolute inset-0 w-full h-full rounded-[2.5rem] cursor-pointer touch-none transition-opacity duration-700 ${revealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            onMouseDown={(e) => { isDrawing.current = true; scratch(getPos(e).x, getPos(e).y); }}
            onMouseMove={(e) => { if (isDrawing.current) scratch(getPos(e).x, getPos(e).y); }}
            onMouseUp={() => { isDrawing.current = false; }}
            onMouseLeave={() => { isDrawing.current = false; }}
            onTouchStart={(e) => { isDrawing.current = true; scratch(getPos(e).x, getPos(e).y); }}
            onTouchMove={(e) => { if (isDrawing.current) scratch(getPos(e).x, getPos(e).y); }}
            onTouchEnd={() => { isDrawing.current = false; }}
          />
        )}
      </div>

      {selected !== null && (
        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => onDone?.(dateOptions[selected])}
          className="w-full max-w-xs py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-[2rem] shadow-xl shadow-pink-200"
        >
          Confirmar e Seguir 💌
        </motion.button>
      )}

      {!revealed && (
        <div className="w-full max-w-[200px] h-1 bg-pink-100 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${percent}%` }} className="h-full bg-pink-500" />
        </div>
      )}
    </div>
  );
}
