import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const notesDir = path.join(process.cwd(), 'Graph Academy Notes');
const outputFile = path.join(process.cwd(), 'src/lib/notes-data.ts');

function parseNotes() {
    if (!fs.existsSync(notesDir)) {
        console.error('Notes directory not found');
        return;
    }

    const files = fs.readdirSync(notesDir).filter(f => f.endsWith('.md'));
    const notes = files.map(file => {
        const filePath = path.join(notesDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: body } = matter(content);

        return {
            filename: file,
            title: data.title || file,
            date: data.date ? new Date(data.date).toISOString() : null,
            content: body,
            contentLength: body.length
        };
    }).filter(n => n.date !== null);

    const tsContent = `export const NOTES_DATA = ${JSON.stringify(notes, null, 2)};`;
    fs.writeFileSync(outputFile, tsContent);
    console.log(`Updated ${outputFile} with ${notes.length} notes.`);
}

parseNotes();
