export interface TimelineNode {
    y: number;
    m: number;
    d: number;
    slot: number;
    val: number;
    id: number;
    isMajor: boolean;
    label: string;
}

export const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
export const SLOT_HOURS = ["06:00", "12:00", "18:00", "00:00"];
export const SLOT_NAMES = ["MORN", "NOON", "EVE", "NIGHT"];

export function generateTimelineData(): TimelineNode[] {
    const TOTAL_DAYS = 365;
    const SLOTS_PER_DAY = 4;

    let data: TimelineNode[] = [];
    let dateCursor = new Date(2025, 0, 1);

    for (let i = 0; i < TOTAL_DAYS; i++) {
        for (let s = 0; s < SLOTS_PER_DAY; s++) {
            // Procedural generation
            let val = Math.random() * 20 + 5;
            if (i % 7 === 0) val += 30; // Spikes on weekends
            if (i > 200 && i < 250) val += 20; // Summer burst

            const m = dateCursor.getMonth();
            const d = dateCursor.getDate();
            const isMajor = d === 1 && s === 0;
            const label = isMajor ? MONTHS[m] : `${d}`;

            data.push({
                y: 2025,
                m: m,
                d: d,
                slot: s,
                val: val,
                id: i * SLOTS_PER_DAY + s,
                isMajor,
                label
            });
        }
        dateCursor.setDate(dateCursor.getDate() + 1);
    }
    return data;
}
