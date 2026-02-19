// Converte 'HH:mm' em minutos totais para comparação fácil
export function toMinutes(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
}

// Dada uma hora de início e fim, determina que "label dinâmica" mostrar
// e que timeRules estão activas
export function resolveTimeContext(startTime, endTime) {
    if (!startTime || !endTime) return null;

    const start = toMinutes(startTime);
    const end = toMinutes(endTime);
    const duration = end - start;

    // Novos critérios de "Coverage" (Invisíveis para o utilizador)
    const hasLunch = start <= 13 * 60 && end >= 14 * 60;
    const hasSnack = start <= 16 * 60 && end >= 17 * 60 && duration > 60; // Pelo menos 1h de cobertura no lanche
    const hasDinner = start <= 20 * 60 && end >= 21 * 30;
    const hasNightOut = end >= 22 * 30 && duration > 120;
    const hasActivity = duration >= 120; // Pelo menos 2h de encontro para justificar planeamento de atividade

    // Badge label (opcional para o frontend usar se quiser)
    let badge = '✨ SPECIAL DATE';
    if (hasNightOut && hasDinner) badge = '🌙 DINNER + NIGHT OUT';
    else if (hasDinner) badge = '🍷 DINNER NIGHT';
    else if (hasLunch) badge = '🍱 LUNCH DATE';
    else if (duration > 6 * 60) badge = '✨ FULL DAY ADVENTURE';

    return {
        badge,
        rules: { hasLunch, hasSnack, hasDinner, hasNightOut, hasActivity },
        durationMinutes: duration
    };
}

const RULE_MAP = {
    'lunch': 'hasLunch',
    'snack': 'hasSnack',
    'dinner': 'hasDinner',
    'night_out': 'hasNightOut'
};

export function resolveActiveSteps(allSteps, answers, options = {}) {
    const { isCreatorMode = false } = options;

    return allSteps.filter(step => {
        // No modo criador, mostramos quase tudo para ele poder editar
        if (isCreatorMode) return true;

        if (!step.showIf) return true;

        const { stepId, timeSlot, timeRule } = step.showIf;
        const answer = answers[stepId];
        if (!answer) return false;

        // Se o criador marcou como surpresa, e não estamos no modo criador, escondemos do convidado
        // (Mas o passo continua "ativo" logicamente para o resumo final)
        if (step.config?.isSurprise) return false;

        // Novo sistema: timeRule ('lunch', 'snack', etc.)
        if (timeRule) {
            const ruleKey = RULE_MAP[timeRule];
            return answer.timeRules?.[ruleKey] || false;
        }

        // Caso especial para atividade (geralmente baseada em duração longa ou regra específica)
        if (step.id === 'step_after_activity') {
            return answer.timeRules?.hasActivity || false;
        }

        // Sistema antigo/legado: timeSlot (array)
        const chosen = answer.time ?? answer.timeSlot ?? answer;
        if (typeof chosen === 'string' && chosen.includes(':')) {
            const context = resolveTimeContext(chosen, chosen); // Fallback: start=end
            const virtualSlots = [];
            if (context.rules.hasLunch) virtualSlots.push('morning');
            if (context.rules.hasSnack) virtualSlots.push('afternoon');
            if (context.rules.hasDinner) virtualSlots.push('evening');
            if (context.rules.hasNightOut) virtualSlots.push('night_out');
            virtualSlots.push('full_day');

            return timeSlot?.some(slot => virtualSlots.includes(slot));
        }

        return timeSlot?.includes(chosen);
    });
}
