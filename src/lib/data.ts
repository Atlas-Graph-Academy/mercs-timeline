import { NOTES_DATA } from './notes-data';

export interface TimelineNode {
    y: number;
    m: number;
    d: number;
    slot: number;
    val: number;
    id: number;
    isMajor: boolean;
    label: string;
    note?: {
        title: string;
        contentLength: number;
    };
}

export const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
export const SLOT_HOURS = ["06:00", "12:00", "18:00", "00:00"];
export const SLOT_NAMES = ["MORN", "NOON", "EVE", "NIGHT"];

export function generateTimelineData(): TimelineNode[] {
    const TOTAL_DAYS = 365;
    const SLOTS_PER_DAY = 4;

    let data: TimelineNode[] = [];
    let dateCursor = new Date(2025, 0, 1);

    // Map notes to keys for quick lookup: "YYYY-MM-DD-Slot"
    const noteMap: Record<string, typeof NOTES_DATA[0]> = {};
    NOTES_DATA.forEach(note => {
        const d = new Date(note.date);
        const hour = d.getHours();
        let slot = 0;
        if (hour >= 21 || hour < 3) slot = 3; // NIGHT (00:00)
        else if (hour >= 3 && hour < 9) slot = 0; // MORN (06:00)
        else if (hour >= 9 && hour < 15) slot = 1; // NOON (12:00)
        else if (hour >= 15 && hour < 21) slot = 2; // EVE (18:00)

        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${slot}`;
        noteMap[key] = note;
    });

    for (let i = 0; i < TOTAL_DAYS; i++) {
        for (let s = 0; s < SLOTS_PER_DAY; s++) {
            const m = dateCursor.getMonth();
            const d = dateCursor.getDate();
            const y = dateCursor.getFullYear();
            const isMajor = d === 1 && s === 0;
            const label = isMajor ? String(m + 1).padStart(2, '0') : `${d}`;

            const key = `${y}-${m}-${d}-${s}`;
            const note = noteMap[key];

            // If note exists, val is based on length, else 0 (cleaning out default bars)
            let val = 0;
            if (note) {
                // Base size is 20, plus relative change for text length
                // Max length roughly 2000 for this scale
                val = 20 + Math.min(note.contentLength / 20, 80);
            }

            data.push({
                y: y,
                m: m,
                d: d,
                slot: s,
                val: val,
                id: i * SLOTS_PER_DAY + s,
                isMajor,
                label,
                note: note ? { title: note.title, contentLength: note.contentLength } : undefined
            });
        }
        dateCursor.setDate(dateCursor.getDate() + 1);
    }
    return data;
}
