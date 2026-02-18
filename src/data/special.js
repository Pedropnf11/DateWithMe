// templates/special.js
//
// LÓGICA CONDICIONAL POR HORÁRIO:
//   morning    → step_lunch → step_after_lunch
//   afternoon  → step_afternoon_activity → step_dinner → step_after_dinner
//   dinner     → step_dinner → step_after_dinner
//   full_day   → step_lunch → step_after_lunch → step_dinner → step_after_dinner
//
// showIf: { stepId: 'step_date', timeSlot: ['...'] }
// processado pelo Invite.jsx para filtrar steps activos dinamicamente.

export const TEMPLATE_SPECIAL = {
    id: 'special',
    label: 'Special Night ✨',
    description: 'Plan every detail of a perfect night.',
    steps: [

        // STEP 1 — Pergunta: NÃO só activo após noUnlocksAfter cliques
        {
            id: 'step_question',
            type: 'question',
            stepLabel: 'STEP 1. THE INVITATION',
            title: 'Will you spend a special night with me? ✨',
            gif: null,
            config: {
                noButtonBehavior: 'growing_yes',
                noUnlocksAfter: 5,
            }
        },

        // STEP 2 — GIF
        {
            id: 'step_happy_gif',
            type: 'happy_gif',
            stepLabel: 'STEP 2. HAPPY GIF (OPTIONAL)',
            title: 'GIF for when they say YES! ✨',
            gif: null
        },

        // STEP 3 — Calendário com time slots configuráveis pelo rapaz
        {
            id: 'step_date',
            type: 'calendar',
            stepLabel: 'STEP 3. DATE & TIME',
            title: 'When are you free?',
            config: {
                askTime: true,
                offerFullCalendar: true,
                calendarMessage: 'Para ti arranjo sempre tempo 💕',
                selectedDates: [],
                timeSlots: [
                    { id: 'morning', label: 'Morning', emoji: '🌅', time: '10:00–12:00', active: true },
                    { id: 'afternoon', label: 'Afternoon', emoji: '☀️', time: '14:00–17:00', active: true },
                    { id: 'dinner', label: 'Dinner', emoji: '🌙', time: '19:00–22:00', active: true },
                    { id: 'full_day', label: 'Full Day', emoji: '✨', time: 'All day', active: true },
                ]
            }
        },

        // ══ CONDICIONAIS ══════════════════════════════════════

        {
            id: 'step_lunch',
            type: 'ranking',
            stepLabel: 'LUNCH',
            title: "What's for lunch?",
            showIf: { stepId: 'step_date', timeSlot: ['morning', 'full_day'] },
            options: [
                { label: 'Italian 🍝', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=600&fit=crop' },
                { label: 'Sushi 🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=600&fit=crop' },
                { label: 'Burger 🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop' },
                { label: 'Tacos 🌮', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=600&fit=crop' },
            ]
        },

        {
            id: 'step_snack',
            type: 'ranking',
            stepLabel: 'SNACK',
            title: "What about a snack?",
            showIf: { stepId: 'step_date', timeSlot: ['afternoon', 'full_day'] },
            options: [
                { label: 'Ice Cream 🍦', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=600&fit=crop' },
                { label: 'Coffee & Cake ☕', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=600&fit=crop' },
                { label: 'Waffles 🧇', image: 'https://images.unsplash.com/photo-1568278272449-f03348f93630?w=600&h=600&fit=crop' },
                { label: 'Acai 🫐', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=600&fit=crop' },
            ]
        },

        {
            id: 'step_dinner',
            type: 'ranking',
            stepLabel: 'DINNER',
            title: "What's for dinner?",
            showIf: { stepId: 'step_date', timeSlot: ['dinner', 'full_day'] },
            options: [
                { label: 'Fine Dining Wine 🍷', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=600&fit=crop' },
                { label: 'Steakhouse 🥩', image: 'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?w=600&h=600&fit=crop' },
                { label: 'Italian 🍝', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=600&fit=crop' },
                { label: 'Sushi 🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=600&fit=crop' },
            ]
        },

        {
            id: 'step_after_activity',
            type: 'ranking',
            stepLabel: 'POST-ACTIVITY',
            title: "To finish our date...",
            options: [
                { label: 'Night walk 🌙', image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&h=600&fit=crop' },
                { label: 'Cinema 🍿', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=600&fit=crop' },
                { label: 'Bowling 🎳', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=600&fit=crop' },
                { label: 'Rooftop Bar 🍹', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=600&fit=crop' },
            ]
        },

        // Rating
        {
            id: 'step_rating',
            type: 'rating',
            stepLabel: 'RATE IT',
            title: 'How excited are you for this? ✨',
            config: { maxStars: 5 }
        },

        // Summary
        {
            id: 'step_summary',
            type: 'summary',
            stepLabel: 'READY?',
            title: 'Review your Special Plan'
        }
    ]
};
