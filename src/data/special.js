// templates/special.js
//
// LÓGICA CONDICIONAL POR HORÁRIO (baseada na hora de início escolhida):
//
//   start ≤ 12:00              → step_lunch   aparece
//   end   ≥ 15:00 (sem almoço) → step_snack   aparece
//   end   ≥ 20:00              → step_dinner  aparece
//   end   ≥ 21:30              → step_dinner + step_night_out aparecem
//
// showIf: { stepId: 'step_date', timeRule: 'lunch' | 'snack' | 'dinner' | 'night_out' }
// A função resolveActiveSteps() em utils.js interpreta estas regras com base em
// { startTime, endTime } guardados na resposta do step_date.

export const TEMPLATE_SPECIAL = {
    id: 'special',
    label: 'Noite Especial ✨',
    description: 'Planeia cada detalhe de uma noite perfeita.',
    steps: [

        // ── STEP 1 — Convite ──────────────────────────────────
        {
            id: 'step_question',
            type: 'question',
            stepLabel: 'PASSO 1. O CONVITE',
            title: 'Queres passar uma noite especial comigo? ✨',
            subtitle: "Diz que sim — não te vais arrepender 😏",
            gif: null,
            config: {
                noButtonBehavior: 'growing_yes',
                noUnlocksAfter: 5,
            }
        },

        // ── STEP 2 — GIF ──────────────────────────────────────
        {
            id: 'step_happy_gif',
            type: 'happy_gif',
            stepLabel: 'O GIF DA VITÓRIA 🏆',
            title: 'GIF para quando ela disser SIM!',
            gif: null
        },

        // ── STEP 3 — Mensagem preparação ────────────────────────
        {
            id: 'step_vibe',
            type: 'ranking',
            title: 'Mensagem preparação para o date',
            subtitle: 'Tudo parece perfeito. Estás pronta?'
        },

        // ── STEP 4 — Calendário ────────────────────────────────
        {
            id: 'step_date',
            type: 'calendar',
            stepLabel: 'PASSO 3. QUANDO ESTÁS LIVRE?',
            title: 'QUANDO ESTÁS LIVRE?',
            subtitle: 'Escolhe um dia e o teu intervalo de tempo.',
            config: {
                mode: 'liberty', // 'liberty' (Mode 1) | 'suggestions' (Mode 2)
                suggestedDates: [],
                calendarMessage: 'Para ti arranjo sempre tempo 💕',
                creatorNote: 'Mal posso esperar para te ver! 💕',
                timeRangeMode: true, // Always true for special
            }
        },

        // ── CONDICIONAIS ──────────────────────────────────────
        {
            id: 'step_lunch',
            type: 'ranking',
            stepLabel: 'ALMOÇO',
            title: "O que vamos almoçar?",
            subtitle: 'Escolhe o teu favorito.',
            showIf: { stepId: 'step_date', timeRule: 'lunch' },
            options: [
                { label: 'Italiano 🍝', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=600&fit=crop' },
                { label: 'Sushi 🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=600&fit=crop' },
                { label: 'Hambúrguer 🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop' },
                { label: 'Tacos 🌮', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=600&fit=crop' },
            ]
        },

        {
            id: 'step_snack',
            type: 'ranking',
            stepLabel: 'LANCHE',
            title: "E um lanchinho?",
            subtitle: 'Um miminho para a tarde.',
            showIf: { stepId: 'step_date', timeRule: 'snack' },
            options: [
                { label: 'Gelado 🍦', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=600&fit=crop' },
                { label: 'Café e Bolo ☕', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=600&fit=crop' },
                { label: 'Waffles 🧇', image: 'https://images.unsplash.com/photo-1568278272449-f03348f93630?w=600&h=600&fit=crop' },
                { label: 'Açaí 🫐', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=600&fit=crop' },
            ]
        },

        {
            id: 'step_dinner',
            type: 'ranking',
            stepLabel: 'JANTAR',
            title: "O que queres jantar?",
            subtitle: 'O prato principal da noite.',
            showIf: { stepId: 'step_date', timeRule: 'dinner' },
            options: [
                { label: 'Fino 🍷', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=600&fit=crop' },
                { label: 'Steakhouse 🥩', image: 'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?w=600&h=600&fit=crop' },
                { label: 'Italiano 🍝', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=600&fit=crop' },
                { label: 'Sushi 🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=600&fit=crop' },
            ]
        },

        {
            id: 'step_night_out',
            type: 'ranking',
            stepLabel: 'SAÍDA À NOITE',
            title: "Onde vamos acabar a noite?",
            subtitle: 'A noite ainda é uma criança.',
            showIf: { stepId: 'step_date', timeRule: 'night_out' },
            options: [
                { label: 'Passeio Noturno 🌙', image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&h=600&fit=crop' },
                { label: 'Rooftop Bar 🍹', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=600&fit=crop' },
                { label: 'Bar de Cocktails 🍸', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=600&fit=crop' },
                { label: 'Discoteca 💃', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&h=600&fit=crop' },
            ]
        },

        // ── Atividade ─────────────────────────────────────────
        {
            id: 'step_after_activity',
            type: 'ranking',
            stepLabel: 'ATIVIDADE',
            title: "E para a atividade principal...",
            subtitle: 'O que vamos fazer juntos?',
            options: [
                { label: 'Cinema 🍿', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=600&fit=crop' },
                { label: 'Bowling 🎳', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=600&fit=crop' },
                { label: 'Arcade 🕹️', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=600&fit=crop' },
                { label: 'Karting 🏎️', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=600&fit=crop' },
            ]
        },

        // ── Rating ────────────────────────────────────────────
        {
            id: 'step_rating',
            type: 'rating',
            stepLabel: 'AVALIAÇÃO',
            title: 'Quão ansiosa estás para isto? ✨',
            subtitle: 'Sê honesta 😏',
            config: { maxStars: 5 }
        },


        // ── Summary ───────────────────────────────────────────
        {
            id: 'step_summary',
            type: 'summary',
            stepLabel: 'PRONTA?',
            title: 'Revê o teu Plano Especial',
            subtitle: 'Tudo parece perfeito. Pronta para enviar?'
        }
    ]
};