
export function buildCalendarDays() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(today.getDate() + 30);

    // Find Monday of the week that contains `today`
    const startOfGrid = new Date(today);
    const dayOfWeek = (today.getDay() + 6) % 7; // Mon=0
    startOfGrid.setDate(today.getDate() - dayOfWeek);

    // Find Sunday of the week that contains `end`
    const endOfGrid = new Date(end);
    const endDayOfWeek = (end.getDay() + 6) % 7;
    endOfGrid.setDate(end.getDate() + (6 - endDayOfWeek));

    const days = [];
    const cur = new Date(startOfGrid);
    while (cur <= endOfGrid) {
        days.push({
            date: new Date(cur),
            inRange: cur >= today && cur <= end,
            isToday: cur.getTime() === today.getTime(),
        });
        cur.setDate(cur.getDate() + 1);
    }
    return days;
}

export const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
export const MONTH_NAMES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
