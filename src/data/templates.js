import { TEMPLATE_FIRST } from './templateFirst';
import { TEMPLATE_SPECIAL } from './special';
import { MessageCircleHeart, Star } from 'lucide-react';

export const TEMPLATES = {
    first_date: { ...TEMPLATE_FIRST, label: 'Quebra o Gelo', description: 'Deixa a tua marca para um primeiro encontro marcante' },
    special: { ...TEMPLATE_SPECIAL, label: 'Date Especial', description: 'Ideal para uma date marcante.' },
    surprise: {
        id: 'surprise',
        label: 'Surpresa',
        description: 'Tu crias a supresa ela vê o resultado no dia',
        questions: [
            {
                id: 'q1',
                title: 'Estás pronta para uma aventura?',
                type: 'question',
            },
            {
                id: 'q2',
                title: 'Vou levar-te ao sítio que mais gostas...',
                type: 'text',
            },
            {
                id: 'gamification',
                behavior: 'runaway',
                type: 'config',
            },
            {
                id: 'q_time',
                value: '20:00',
                type: 'config',
            },
            {
                id: 'q_location',
                value: 'Sítio Secreto',
                type: 'config',
            }
        ]
    }
};
