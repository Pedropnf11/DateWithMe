import SpecialSuccessView from './SpecialSuccessView';
import IcebreakerSuccessView from './IcebreakerSuccessView';

export default function SuccessView({ creatorNote, answers, templateId }) {
    const isSpecial = templateId === 'special';

    if (isSpecial) {
        // No modo especial, usamos a mensagem personalizada do Passo 2 (step_vibe) se for uma string
        // senão usamos a nota do criador
        const vibeAnswer = answers?.step_vibe;
        const specialMessage = (typeof vibeAnswer === 'string' && vibeAnswer.length > 0)
            ? vibeAnswer
            : creatorNote;
        return <SpecialSuccessView creatorNote={specialMessage} />;
    }

    return <IcebreakerSuccessView creatorNote={creatorNote} />;
}
