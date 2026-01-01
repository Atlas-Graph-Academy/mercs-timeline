import fs from 'fs';
import path from 'path';

const notesFile = path.join(process.cwd(), 'Graph Academy Notes/GA-NOTE-Dec 30- 2024 to Jan 23- 2025.md');
const outputFile = path.join(process.cwd(), 'src/lib/notes-data.ts');

function parseNotes() {
    if (!fs.existsSync(notesFile)) {
        console.error('Notes file not found:', notesFile);
        return;
    }

    const content = fs.readFileSync(notesFile, 'utf8');

    // Split by ## headers
    const segments = content.split(/\n## /);

    const notes = [];

    segments.forEach((segment, index) => {
        if (index === 0 && !segment.startsWith('## ')) {
            // This might be the summary header
            return;
        }

        const lines = segment.split('\n');
        const title = lines[0].replace('## ', '').trim();

        // Find "Created" date
        const createdMatch = segment.match(/\*\*Created\*\*:\s*([^\n]+)/);
        if (!createdMatch) return;

        let dateStr = createdMatch[1].trim();
        // Standardize: "Dec 30, 2024 at 11:01 PM" -> "Dec 30, 2024 11:01 PM"
        dateStr = dateStr.replace(' at ', ' ');

        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) {
            console.warn(`Invalid date found in note "${title}": ${dateStr}`);
            return;
        }

        // Extract content after ### Content
        const contentMatch = segment.split('### Content');
        let body = '';
        if (contentMatch.length > 1) {
            body = contentMatch[1].split(/\n---/)[0].trim();
        }

        notes.push({
            title,
            date: dateObj.toISOString(),
            content: body,
            contentLength: body.length
        });
    });

    const tsContent = `export const NOTES_DATA = ${JSON.stringify(notes, null, 2)};`;
    fs.writeFileSync(outputFile, tsContent);
    console.log(`Updated ${outputFile} with ${notes.length} notes.`);
}

parseNotes();
