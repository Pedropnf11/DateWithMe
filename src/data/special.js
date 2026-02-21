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

import f_italian from '../assets/foods/f_italian.webp';
import f_sushi from '../assets/foods/f_sushi.webp';
import f_francesinha from '../assets/foods/f_francesinha.webp';
import f_mexican from '../assets/foods/f_mexican.webp';
import f_coffe from '../assets/foods/f_coffe.webp';
import f_icook_m from '../assets/foods/f-icook_m.webp';
import f_icookHome_n from '../assets/foods/f_icookHome_n.webp';
import f_hamburger from '../assets/foods/f_hamburger.webp';

import a_icecream from '../assets/activities/a_icecream.webp';
import a_Gameroom from '../assets/activities/a_Gameroom.webp';
import a_MovieHouse from '../assets/activities/a_MovieHouse.webp';
import a_aquashow from '../assets/activities/a_aquashow.webp';
import a_bar_n from '../assets/activities/a_bar_n.webp';
import a_bowlling from '../assets/activities/a_bowlling.webp';
import a_cinema from '../assets/activities/a_cinema.webp';
import a_gameHome_img from '../assets/activities/a_gameHome_img.webp';
import a_golf from '../assets/activities/a_golf.webp';
import a_museu from '../assets/activities/a_museu.webp';
import a_painting from '../assets/activities/a_painting.webp';
import a_piquenique from '../assets/activities/a_piquenique.webp';
import a_reading from '../assets/activities/a_reading.webp';
import a_videogames from '../assets/activities/a_videogames.webp';
import a_walk_n from '../assets/activities/a_walk_n.webp';
import a_disco from '../assets/activities/a_disco_n.webp';
import a_açai from '../assets/activities/a_açai.webp';

// Local GIFs WebP
import invite_special from '../assets/gifs/invite_special.webp';
import calendar_wait from '../assets/gifs/calendar_wait.webp';

export const TEMPLATE_SPECIAL = {
    id: 'special',
    label: 'Noite Especial',
    description: 'Planeia cada detalhe de uma noite perfeita.',
    steps: [

        // ── STEP 1 — Convite ──────────────────────────────────
        {
            id: 'step_question',
            type: 'question',
            stepLabel: 'PASSO 1. O CONVITE',
            title: 'Queres passar uma noite especial comigo? ✨',
            subtitle: "Diz que sim — não te vais arrepender 😏",
            gif: invite_special,
            config: {
                noButtonBehavior: 'growing_yes',
                noUnlocksAfter: 5,
            }
        },


        // ── STEP 3 — Mensagem preparação ────────────────────────
        {
            id: 'step_vibe',
            type: 'message',
            stepLabel: 'PASSO 2. A TUA MENSAGEM',
            title: '',
            subtitle: ''
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
                libertyMessage: 'Para ti tenho todo o tempo do mundo...',
                libertyGif: calendar_wait,
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
                { label: 'Italiano ', image: f_italian },
                { label: 'Sushi', image: f_sushi },
                { label: 'Francesinha ', image: f_francesinha },
                { label: 'Comida Mexicana', image: f_mexican },
                { label: 'Comida Feita por mim', image: f_icook_m },

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
                { label: 'Gelado', image: a_icecream },
                { label: 'Coffee', image: f_coffe },
                { label: 'Hamburger ', image: f_hamburger },
                { label: 'Açaí 🫐', image: a_açai },
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
                { label: 'Italiano', image: f_italian },
                { label: 'Sushi', image: f_sushi },
                { label: 'Francesinha ', image: f_francesinha },
                { label: 'Mexicano ', image: f_mexican },
                { label: 'Hamburguer ', image: f_hamburger },
                { label: 'Eu Cozinho (Jantar)', image: f_icookHome_n },
            ]
        },

        {
            id: 'step_night_out',
            type: 'ranking',
            stepLabel: 'SAÍDA À NOITE',
            title: "Onde vamos acabar a noite?",
            subtitle: 'A noite ainda é uma criança',
            showIf: { stepId: 'step_date', timeRule: 'night_out' },
            options: [
                { label: 'Bar / Cocktails ', image: a_bar_n },
                { label: 'Passeio Noturno ', image: a_walk_n },
                { label: 'Filme em casa ', image: a_MovieHouse },
                { label: 'VideoJogos em Casa ', image: a_videogames },
                { label: 'Noite de Jogos ', image: a_gameHome_img },
                { label: 'Bowling ', image: a_bowlling },
                { label: 'Cinema ', image: a_cinema },
                { label: 'Disco', image: a_disco },
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
                { label: 'Cinema', image: a_cinema },
                { label: 'Bowling ', image: a_bowlling },
                { label: 'Arcade / Jogos ', image: a_Gameroom },
                { label: 'Mini Golf ', image: a_golf },
                { label: 'Museu ', image: a_museu },
                { label: 'Painting Date ', image: a_painting },
                { label: 'Jogos em Casa ', image: a_gameHome_img },
                { label: 'Aquário', image: a_aquashow },
                { label: 'Ler ao ar livre/caminhar ', image: a_reading },
            ]
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