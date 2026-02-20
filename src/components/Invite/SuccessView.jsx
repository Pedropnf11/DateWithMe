import SpecialSuccessView from './SpecialSuccessView';
import IcebreakerSuccessView from './IcebreakerSuccessView';

export default function SuccessView({ creatorNote, answers, templateId }) {
    const isSpecial = templateId === 'special';

    if (isSpecial) {
        // No modo especial, usamos a mensagem personalizada do Passo 2 (step_vibe)
        const specialMessage = answers?.step_vibe || creatorNote;
        return <SpecialSuccessView creatorNote={specialMessage} />;
    }

    return <IcebreakerSuccessView creatorNote={creatorNote} />;
}
