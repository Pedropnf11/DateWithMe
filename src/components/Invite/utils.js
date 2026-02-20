// Converte 'HH:mm' em minutos totais para comparação fácil
export function toMinutes(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
}

export function resolveTimeContext(startTime, endTime) {
    if (!startTime || !endTime) return null;

    const start = toMinutes(startTime);
    const end = toMinutes(endTime);
    const duration = end - start;

    const hasLunch    = start <= 13 * 60 && end >= 14 * 60;
    const hasSnack    = start <= 16 * 60 && end >= 17 * 60 && duration > 60;
    const hasDinner   = start <= 20 * 60 && end >= 21 * 60;
    const hasNightOut = end >= 22 * 60 && duration > 120;
    const hasActivity = duration >= 120;

    let badge = '✨ SPECIAL DATE';
    if (hasNightOut && hasDinner) badge = '🌙 DINNER + NIGHT OUT';
    else if (hasDinner)           badge = '🍷 DINNER NIGHT';
    else if (hasLunch)            badge = '🍱 LUNCH DATE';
    else if (duration > 6 * 60)   badge = '✨ FULL DAY ADVENTURE';

    return {
        badge,
        rules: { hasLunch, hasSnack, hasDinner, hasNightOut, hasActivity },
        durationMinutes: duration
    };
}

const RULE_MAP = {
    'lunch':    'hasLunch',
    'snack':    'hasSnack',
    'dinner':   'hasDinner',
    'night_out':'hasNightOut',
    'activity': 'hasActivity',
};

export function resolveActiveSteps(allSteps, answers, options = {}) {
    const { isCreatorMode = false } = options;

    return allSteps.filter(step => {
        if (isCreatorMode) return true;
        if (!step.showIf) return true;

        const { stepId, timeRule } = step.showIf;
        const answer = answers[stepId];
        if (!answer) return false;

        if (step.config?.isSurprise) return false;

        if (timeRule) {
            const ruleKey = RULE_MAP[timeRule];
            return answer.timeRules?.[ruleKey] || false;
        }

        if (step.id === 'step_after_activity') {
            return answer.timeRules?.hasActivity || false;
        }

        const chosen = answer.time ?? answer.timeSlot ?? answer;
        if (typeof chosen === 'string' && chosen.includes(':')) {
            const context = resolveTimeContext(chosen, chosen);
            const virtualSlots = [];
            if (context.rules.hasLunch)    virtualSlots.push('morning');
            if (context.rules.hasSnack)    virtualSlots.push('afternoon');
            if (context.rules.hasDinner)   virtualSlots.push('evening');
            if (context.rules.hasNightOut) virtualSlots.push('night_out');
            virtualSlots.push('full_day');
            return step.showIf?.timeSlot?.some(slot => virtualSlots.includes(slot));
        }

        return step.showIf?.timeSlot?.includes(chosen);
    });
}
