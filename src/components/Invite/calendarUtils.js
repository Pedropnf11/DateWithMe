export function buildCalendarDays() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(today.getDate() + 30);

    const startOfGrid = new Date(today);
    const dayOfWeek = (today.getDay() + 6) % 7;
    startOfGrid.setDate(today.getDate() - dayOfWeek);

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

export function toDateStr(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
export const MONTH_NAMES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
