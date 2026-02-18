import { TEMPLATE_FIRST } from './templateFirst';
import { TEMPLATE_SPECIAL } from './special';
import { MessageCircleHeart, Star } from 'lucide-react';

export const TEMPLATES = {
    first_date: TEMPLATE_FIRST,
    special: TEMPLATE_SPECIAL,
    surprise: {
        id: 'surprise',
        label: 'Surprise 🎲',
        description: 'Deixa a curiosidade dominar. O plano é secreto.',
        questions: [
            {
                id: 'q1',
                customText: 'Estás pronta para uma aventura?',
                type: 'choice',
                options: [
                    { id: 'yes', label: 'SIM, nasci pronta! 🚀', icon: Star },
                    { id: 'maybe', label: 'Talvez... diz-me mais 👀', icon: MessageCircleHeart },
                ]
            },
            {
                id: 'q2',
                customText: 'A que horas te passo a buscar?',
                type: 'text',
                placeholder: 'Ex: Às 20h00, esteja onde estiveres.'
            }
        ]
    }
};
