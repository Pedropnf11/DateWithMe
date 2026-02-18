
export const TEMPLATE_FIRST = {
    id: 'first_date',
    label: 'First Date 🌸',
    description: 'The perfect way to ask someone out.',
    steps: [
        {
            id: 'step_question',
            type: 'question',
            stepLabel: 'STEP 1. ASK YOUR QUESTION',
            title: 'Would you like to go on a date with me?',
            gif: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm9lMjExcmI0ODIzb3g5NTc3bDU2d3poZXhqeTMxaTl2a2w3aHZyaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/I1nwVpCaB4k36/giphy.gif',
            config: {
                noButtonBehavior: 'runaway', // 'runaway' | 'growing_yes' | 'none'
            }
        },
        {
            id: 'step_happy_gif',
            type: 'happy_gif',
            stepLabel: 'STEP 2. HAPPY GIF (OPTIONAL)',
            title: 'Choose a GIF for when they say YES!',
            gif: null
        },
        {
            id: 'step_date',
            type: 'calendar',
            stepLabel: 'STEP 3. TIME & DATE',
            title: 'When are you free?',
            config: {
                askTime: true
            }
        },
        {
            id: 'step_food',
            type: 'ranking',
            stepLabel: 'STEP 4. FOOD PREFERENCES',
            title: 'What would you like to eat?',
            subtitle: 'They will choose their favorite.',
            options: [
                { label: 'Sushi 🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop' },
                { label: 'Pizza 🍕', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop' },
                { label: 'Burgers 🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' },
                { label: 'Tacos 🌮', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop' }
            ]
        },
        {
            id: 'step_activity',
            type: 'ranking',
            stepLabel: 'STEP 5. ACTIVITY',
            title: 'What should we do?',
            subtitle: 'They will choose their favorite.',
            options: [
                { label: 'Cinema 🍿', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=400&fit=crop' },
                { label: 'Bowling 🎳', image: 'https://images.unsplash.com/photo-1538514104992-0b2a5789729d?w=400&h=400&fit=crop' },
                { label: 'Park 🌳', image: 'https://images.unsplash.com/photo-1476994230281-1448088947db?w=400&h=400&fit=crop' },
                { label: 'Mini Golf ⛳', image: 'https://images.unsplash.com/photo-1592388796859-99a380cecb7e?w=400&h=400&fit=crop' }
            ]
        },
        {
            id: 'step_rating',
            type: 'rating',
            stepLabel: 'STEP 6. RATE MY EFFORT',
            title: 'How many points do I get for this presentation?',
            gif: 'https://media1.tenor.com/m/4drPS4VXFFYAAAAC/o-incr%C3%ADvel-mundo-de-gumball.gif',
            config: {
                maxStars: 5
            }
        },
        {
            id: 'step_summary',
            type: 'summary',
            stepLabel: 'READY TO SEND?',
            title: 'Review your Date Plan'
        }
    ]
};
