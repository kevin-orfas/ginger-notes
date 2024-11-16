import {findNotes, getAllNotes, newNote, removeAllNotes, removeNote} from './notes.mjs';
import {listNotes} from './utils.mjs';
import {start} from './server.mjs';

const args = process.argv.slice(2);
const command = args[0];

async function printUsage() {
    console.log(`
Usage:
    new <note> [--tags tag1,tag2]  Create a new note
    all                            Get all notes
    find <filter>                  Find notes matching filter
    remove <id>                    Remove a note by id
    web [port]                     Launch website (default port: 5000)
    clean                          Remove all notes
    help                           Show this help message
    `);
}

async function parseTagsOption(args) {
    const tagIndex = args.indexOf('--tags');
    if (tagIndex === -1) return [];

    if (tagIndex + 1 >= args.length) {
        console.error('Error: --tags requires a value');
        process.exit(1);
    }

    return args[tagIndex + 1].split(',');
}

async function main() {
    if (!command || command === 'help') {
        await printUsage();
        process.exit(0);
    }

    try {
        switch (command) {
            case 'new': {
                const noteContent = args[1];
                if (!noteContent) {
                    console.error('Error: Note content is required');
                    process.exit(1);
                }
                const tags = await parseTagsOption(args);
                const note = await newNote(noteContent, tags);
                console.log('Note added!', note.id);
                break;
            }

            case 'all': {
                const notes = await getAllNotes();
                listNotes(notes);
                break;
            }

            case 'find': {
                const filter = args[1];
                if (!filter) {
                    console.error('Error: Search filter is required');
                    process.exit(1);
                }
                const notes = await findNotes(filter);
                listNotes(notes);
                break;
            }

            case 'remove': {
                const id = parseInt(args[1]);
                if (isNaN(id)) {
                    console.error('Error: Valid note ID is required');
                    process.exit(1);
                }
                const removedId = await removeNote(id);
                if (removedId) {
                    console.log('Note removed: ', removedId);
                } else {
                    console.log('Note not found');
                }
                break;
            }

            case 'web': {
                const port = parseInt(args[1]) || 5000;
                const notes = await getAllNotes();
                start(notes, port);
                break;
            }

            case 'clean': {
                await removeAllNotes();
                console.log('All notes removed');
                break;
            }

            default: {
                console.error(`Unknown command: ${command}`);
                await printUsage();
                process.exit(1);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

try {
    main();
} catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
}

