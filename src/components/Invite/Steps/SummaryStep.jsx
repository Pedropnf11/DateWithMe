import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-').map(Number);
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const date = new Date(y, m - 1, d);
    return `${weekdays[date.getDay()]}, ${d} de ${MONTH_NAMES[m - 1]}`;
}

function SummaryCard({ emoji, label, value }) {
    if (!value) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-pink-50"
        >
            <div className="w-11 h-11 bg-pink-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                {emoji}
            </div>
            <div className="text-left">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-black text-gray-800">{value}</p>
            </div>
        </motion.div>
    );
}

export default function SummaryStep({ answers, onConfirm, isSubmitting }) {
    const dateAnswer = answers['step_date'];
    const foodAnswer = answers['step_food'] || answers['step_lunch'];
    const actAnswer = answers['step_activity'] || answers['step_after_activity'];
    const ratingAnswer = answers['step_rating'];
    const snackAnswer = answers['step_snack'];
    const dinnerAnswer = answers['step_dinner'];
    const nightAnswer = answers['step_night_out'];

    const dateStr = dateAnswer?.date;
    const startTime = dateAnswer?.startTime;
    const endTime = dateAnswer?.endTime;
    const badge = dateAnswer?.badge;

    // Primeira opção escolhida em cada ranking
    const firstOf = (arr) => (Array.isArray(arr) ? arr[0] : null);

    const food = firstOf(foodAnswer) || firstOf(dinnerAnswer);
    const lunch = firstOf(foodAnswer);  // quebra-gelo usa step_lunch também
    const act = firstOf(actAnswer);
    const snack = firstOf(snackAnswer);
    const night = firstOf(nightAnswer);
    const stars = ratingAnswer ? '⭐'.repeat(ratingAnswer) : null;

    const hasAny = dateStr || food || act || stars;

    return (
        <div className="space-y-6 w-full">
            <div className="text-center space-y-1">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="text-5xl mb-3"
                >

                </motion.div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                    Aqui está o possível plano
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Analisa bem tuo
                </p>
            </div>

            {badge && (
                <div className="text-center">
                    <span className="px-4 py-1.5 bg-pink-50 text-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-pink-100">
                        {badge}
                    </span>
                </div>
            )}

            <div className="space-y-3">
                <SummaryCard emoji="📅" label="Data" value={formatDate(dateStr)} />
                <SummaryCard emoji="🕐" label="Horário" value={startTime && endTime ? `${startTime} → ${endTime}` : null} />
                <SummaryCard emoji="🍽️" label="Comida Top 1st" value={food || lunch} />
                <SummaryCard emoji="☕" label="Lanche Top 1st" value={snack} />
                <SummaryCard emoji="🎯" label="Atividade Top 1st" value={act} />
                <SummaryCard emoji="🌙" label="Noite Top 1st" value={night} />
                <SummaryCard emoji="⭐" label="A tua avaliação" value={stars} />
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-[2rem] shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
                {isSubmitting ? 'A finalizar...' : <>É um date! 💕 <ChevronRight size={20} strokeWidth={3} /></>}
            </motion.button>
        </div>
    );
}
