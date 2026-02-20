import f_sushi from '../assets/foods/f_sushi.png';
import f_italian from '../assets/foods/f_italian.png';
import f_hamburger from '../assets/foods/f_hamburger.png';
import f_mexican from '../assets/foods/f_mexican.png';
import f_francesinha from '../assets/foods/f_francesinha.png';
import f_coffe from '../assets/foods/f_coffe.png';
import f_icookHome_n from '../assets/foods/f_icookHome_n.png';

import a_cinema from '../assets/activities/a_cinema.png';
import a_bowlling from '../assets/activities/a_bowlling.png';
import a_piquenique from '../assets/activities/a_piquenique.png';
import a_golf from '../assets/activities/a_golf.png';
import a_museu from '../assets/activities/a_museu.png';
import a_walk_n from '../assets/activities/a_walk_n.png';
import a_Gameroom from '../assets/activities/a_Gameroom.png';
import a_painting from '../assets/activities/a_painting.png';
import a_aquashow from '../assets/activities/a_aquashow.png';

export const TEMPLATE_FIRST = {
    id: 'first_date',
    label: 'Quebra o Gelo',
    description: 'Para quando queres impressionar logo à primeira.',
    steps: [
        // ── STEP 1 — Convite ──────────────────────────────────
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

        // ── STEP 2 — GIF Feliz ────────────────────────────────
        {
            id: 'step_happy_gif',
            type: 'happy_gif',
            stepLabel: 'PASSO 2. GIF FELIZ',
            title: 'Escolhe um GIF para quando ela disser SIM!',
            gif: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDlrYXh6dG54MGJrcnEzcGZrdGNkYTB1MWRqZmdjd3lxa3Btdmc2aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cXblnKXr2BQOaYnTni/giphy.gif'
        },

        // ── STEP 3 — Calendário ───────────────────────────────
        {
            id: 'step_date',
            type: 'calendar',
            stepLabel: 'PASSO 3. DIA E HORA',
            title: 'Quando estás livre?',
            config: {
                mode: 'liberty',
                suggestedDates: [],
                calendarMessage: 'Para ti arranjo sempre tempo 💕',
                timeRangeMode: true,
                libertyMessage: 'Para ti tenho todo o tempo do mundo...',
                libertyGif: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnNkZ3Nyd3kzem5yMTUxOHQ4Zms1cm0xamM4MnExbWRmdnRqNXBmMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2JIdU9G4NwGBua0U/giphy.gif',
            }
        },

        // ── STEP 4 — Comida (sempre aparece) ──────────────────
        {
            id: 'step_food',
            type: 'ranking',
            stepLabel: 'COMIDA',
            title: 'O que vamos comer?',
            subtitle: 'Escolhe a tua favorita.',
            options: [
                { label: 'Sushi', image: f_sushi },
                { label: 'Italiano', image: f_italian },
                { label: 'Burgers', image: f_hamburger },
                { label: 'Mexican', image: f_mexican },
                { label: 'Francesinha', image: f_francesinha },
                { label: 'Café / Doces', image: f_coffe },
                { label: 'Cozinho eu!', image: f_icookHome_n },
            ]
        },

        // ── STEP 5 — Atividade (sempre aparece) ───────────────
        {
            id: 'step_activity',
            type: 'ranking',
            stepLabel: 'ATIVIDADE',
            title: 'O que vamos fazer?',
            subtitle: 'Escolhe a tua favorita.',
            options: [
                { label: 'Cinema', image: a_cinema },
                { label: 'Bowling', image: a_bowlling },
                { label: 'Arcade / Jogos', image: a_Gameroom },
                { label: 'Mini Golf', image: a_golf },
                { label: 'Museu', image: a_museu },
                { label: 'Painting Date', image: a_painting },
                { label: 'Aquário', image: a_aquashow },
                { label: 'Passeio', image: a_walk_n },
                { label: 'Piquenique', image: a_piquenique },
            ]
        },

        // ── STEP 6 — Avaliação ────────────────────────────────
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

        // ── STEP 7 — Resumo ───────────────────────────────────
        {
            id: 'step_summary',
            type: 'summary',
            stepLabel: 'PRONTO PARA ENVIAR?',
            title: 'Revisão do teu Plano de Date'
        }
    ]
};
