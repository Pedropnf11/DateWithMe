// templates/special.js

export const TEMPLATE_SPECIAL = {
    id: 'special',
    label: 'Special Night ✨',
    description: 'Plan every detail of a perfect night.',
    steps: [
        {
            id: 'step_question',
            type: 'question',
            stepLabel: 'STEP 1. THE INVITATION',
            title: 'Will you spend a special night with me? ✨',
            gif: null,
            config: {
                noButtonBehavior: 'growing_yes',
            }
        },
        {
            id: 'step_happy_gif',
            type: 'happy_gif',
            stepLabel: 'STEP 2. HAPPY GIF (OPTIONAL)',
            title: 'GIF for when they say YES! ✨',
            gif: null
        },
        {
            id: 'step_food',
            type: 'ranking',
            stepLabel: 'STEP 3. DINNER PLANS',
            title: "What's for dinner?",
            subtitle: 'They will choose their favourite.',
            options: [
                { label: 'Sushi 🍣',        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop' },
                { label: 'Italian 🍝',       image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop' },
                { label: 'Fine Dining 🍷',   image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop' },
                { label: 'Mexican 🌮',       image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop' },
                { label: 'Burger 🍔',        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' },
                { label: 'Steak 🥩',         image: 'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?w=400&h=400&fit=crop' },
            ]
        },
        {
            id: 'step_activity',
            type: 'ranking',
            stepLabel: 'STEP 4. AFTER DINNER',
            title: 'What should we do after?',
            subtitle: 'Pick your favourite.',
            options: [
                { label: 'Rooftop Bar 🌃',   image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=400&fit=crop' },
                { label: 'Walk 🌙',           image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&h=400&fit=crop' },
                { label: 'Cinema 🍿',         image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=400&fit=crop' },
                { label: 'Dance 🕺',          image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=400&fit=crop' },
            ]
        },
        {
            id: 'step_date',
            type: 'calendar',
            stepLabel: 'STEP 5. TIME & DATE',
            title: 'When are you free?',
            config: { askTime: true }
        },
        {
            id: 'step_rating',
            type: 'rating',
            stepLabel: 'STEP 6. RATE THE PLAN',
            title: 'How excited are you? ✨',
            config: { maxStars: 5 }
        },
        {
            id: 'step_summary',
            type: 'summary',
            stepLabel: 'READY TO SEND?',
            title: 'Review your Special Night Plan'
        }
    ]
};
