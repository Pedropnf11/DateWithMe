export const TEMPLATE_FIRST = {
    id: 'first_date',
    label: 'Quebra o Gelo',
    description: 'Para quando queres impressionar logo à primeira.',
    steps: [
        {
            id: 'step_question',
            type: 'question',
            stepLabel: 'PASSO 1. FAZ A PERGUNTA',
            title: 'Que achas de sairmos juntos?',
            gif: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm9lMjExcmI0ODIzb3g5NTc3bDU2d3poZXhqeTMxaTl2a2w3aHZyaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/I1nwVpCaB4k36/giphy.gif',
            config: {
                noButtonBehavior: 'block_cute',
            }
        },
        {
            id: 'step_happy_gif',
            type: 'happy_gif',
            stepLabel: 'PASSO 2. GIF FELIZ',
            title: 'Escolhe um GIF para quando ela disser SIM!',
            gif: null
        },
        {
            id: 'step_date',
            type: 'calendar',
            stepLabel: 'PASSO 3. DIA E HORA',
            title: 'Quando estás livre?',
            config: {
                mode: 'liberty',
                suggestedDates: [],
                calendarMessage: 'Para ti arranjo sempre tempo 💕',
                creatorNote: 'Mal posso esperar para te ver! 💕',
                timeRangeMode: true,
                libertyMessage: 'Para ti tenho todo o tempo do mundo...',
                libertyGif: 'https://media.tenor.com/CAtqFqK_2i0AAAAd/dance-girl.gif',
            }
        },
        {
            id: 'step_food',
            type: 'ranking',
            stepLabel: 'COMIDA',
            title: 'O que vamos comer?',
            subtitle: 'Escolhe a tua favorita.',
            showIf: { stepId: 'step_date', timeRule: 'dinner' },
            options: [
                { label: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop' },
                { label: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop' },
                { label: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' },
                { label: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop' }
            ]
        },
        {
            id: 'step_lunch',
            type: 'ranking',
            stepLabel: 'ALMOÇO',
            title: 'O que vamos almoçar?',
            subtitle: 'Escolhe a tua favorita.',
            showIf: { stepId: 'step_date', timeRule: 'lunch' },
            options: [
                { label: 'Italiano', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=600&fit=crop' },
                { label: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=600&fit=crop' },
                { label: 'Hamburguer', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop' },
                { label: 'Tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=600&fit=crop' },
            ]
        },
        {
            id: 'step_activity',
            type: 'ranking',
            stepLabel: 'ATIVIDADE',
            title: 'O que vamos fazer?',
            subtitle: 'Escolhe a tua favorita.',
            showIf: { stepId: 'step_date', timeRule: 'activity' },
            options: [
                { label: 'Cinema', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=400&fit=crop' },
                { label: 'Bowling', image: 'https://images.unsplash.com/photo-1538514104992-0b2a5789729d?w=400&h=400&fit=crop' },
                { label: 'Parque', image: 'https://images.unsplash.com/photo-1476994230281-1448088947db?w=400&h=400&fit=crop' },
                { label: 'Mini Golf', image: 'https://images.unsplash.com/photo-1592388796859-99a380cecb7e?w=400&h=400&fit=crop' }
            ]
        },
        {
            id: 'step_rating',
            type: 'rating',
            stepLabel: 'AVALIAÇÃO',
            title: 'Quantos pontos ganhei com isto?',
            gif: 'https://media1.tenor.com/m/4drPS4VXFFYAAAAC/o-incr%C3%ADvel-mundo-de-gumball.gif',
            config: {
                maxStars: 5
            }
        },
        {
            id: 'step_summary',
            type: 'summary',
            stepLabel: 'PRONTO PARA ENVIAR?',
            title: 'Revisão do teu Plano de Date'
        }
    ]
};
