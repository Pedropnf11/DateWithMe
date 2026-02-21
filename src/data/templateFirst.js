import f_sushi from '../assets/foods/f_sushi.webp';
import f_italian from '../assets/foods/f_italian.webp';
import f_hamburger from '../assets/foods/f_hamburger.webp';
import f_mexican from '../assets/foods/f_mexican.webp';
import f_francesinha from '../assets/foods/f_francesinha.webp';
import f_coffe from '../assets/foods/f_coffe.webp';
import f_icookHome_n from '../assets/foods/f_icookHome_n.webp';

import a_cinema from '../assets/activities/a_cinema.webp';
import a_bowlling from '../assets/activities/a_bowlling.webp';
import a_piquenique from '../assets/activities/a_piquenique.webp';
import a_golf from '../assets/activities/a_golf.webp';
import a_museu from '../assets/activities/a_museu.webp';
import a_walk_n from '../assets/activities/a_walk_n.webp';
import a_Gameroom from '../assets/activities/a_Gameroom.webp';
import a_painting from '../assets/activities/a_painting.webp';
import a_aquashow from '../assets/activities/a_aquashow.webp';

// Local GIFs WebP
import invite_stitch from '../assets/gifs/invite_stitch.webp';
import happy_dance from '../assets/gifs/happy_dance.webp';
import calendar_wait from '../assets/gifs/calendar_wait.webp';
import rating_gumball from '../assets/gifs/rating_gumball.webp';

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
            gif: invite_stitch,
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
            gif: happy_dance
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
                libertyGif: calendar_wait,
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
                { label: 'Café', image: f_coffe },
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
            gif: rating_gumball,
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
