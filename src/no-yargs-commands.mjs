import { newNote, getAllNotes, findNotes, removeNote, removeAllNotes } from './notes.mjs'
import { listNotes } from './utils.mjs'
import { start } from './server.mjs'

class CommandError extends Error {
    constructor(message, showUsage = false) {
        super(message);
        this.name = 'CommandError';
        this.showUsage = showUsage;
    }
}

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

export async function validatePort(port) {
    const parsedPort = parseInt(port);
    if (isNaN(parsedPort)) {
        throw new CommandError('Port must be a number');
    }
    if (parsedPort < 0 || parsedPort > 65535) {
        throw new CommandError('Port must be between 0 and 65535');
    }
    return parsedPort;
}

async function validateId(id) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        throw new CommandError('ID must be a number');
    }
    if (parsedId < 0) {
        throw new CommandError('ID must be a positive number');
    }
    return parsedId;
}

async function parseTagsOption(args) {
    const tagIndex = args.indexOf('--tags');
    if (tagIndex === -1) return [];

    if (tagIndex + 1 >= args.length) {
        throw new CommandError('--tags requires a value');
    }

    const tags = args[tagIndex + 1].split(',');
    if (tags.some(tag => !tag.trim())) {
        throw new CommandError('Tags cannot be empty');
    }

    return tags;
}

async function validateNoteContent(content) {
    if (!content || typeof content !== 'string') {
        throw new CommandError('Note content is required and must be a string', true);
    }
    if (content.trim().length === 0) {
        throw new CommandError('Note content cannot be empty');
    }
    return content.trim();
}

async function executeCommand(command, args) {
    switch (command) {
        case 'new': {
            const noteContent = await validateNoteContent(args[1]);
            const tags = await parseTagsOption(args);
            const note = await newNote(noteContent, tags);
            console.log('Note added!', note.id);
            break;
        }

        case 'all': {
            const notes = await getAllNotes();
            if (notes.length === 0) {
                console.log('No notes found');
                return;
            }
            listNotes(notes);
            break;
        }

        case 'find': {
            const filter = args[1];
            if (!filter) {
                throw new CommandError('Search filter is required', true);
            }
            const notes = await findNotes(filter);
            if (notes.length === 0) {
                console.log('No notes found matching filter');
                return;
            }
            listNotes(notes);
            break;
        }

        case 'remove': {
            if (!args[1]) {
                throw new CommandError('Note ID is required', true);
            }
            const id = await validateId(args[1]);
            const removedId = await removeNote(id);
            if (removedId) {
                console.log('Note removed: ', removedId);
            } else {
                throw new CommandError(`Note with ID ${id} not found`);
            }
            break;
        }

        case 'web': {
            const port = args[1] ? await validatePort(args[1]) : 5000;
            const notes = await getAllNotes();
            try {
                await start(notes, port);
                console.log(`Server started on port ${port}`);
            } catch (error) {
                throw new CommandError(`Failed to start server: ${error.message}`);
            }
            break;
        }

        case 'clean': {
            const notes = await getAllNotes();
            if (notes.length === 0) {
                console.log('No notes to remove');
                return;
            }
            await removeAllNotes();
            console.log('All notes removed');
            break;
        }

        case 'help': {
            await printUsage();
            break;
        }

        default: {
            throw new CommandError(`Unknown command: ${command}`, true);
        }
    }
}

async function main() {
    if (!command) {
        throw new CommandError('No command provided', true);
    }

    try {
        await executeCommand(command, args);
    } catch (error) {
        if (error instanceof CommandError) {
            console.error('Error:', error.message);
            if (error.showUsage) {
                await printUsage();
            }
            process.exit(1);
        }
        throw error; // Re-throw unexpected errors
    }
}

// Option 1: Using top-level await (if supported)
// try {
//     await main();
// } catch (error) {
//     console.error('Fatal error:', error);
//     process.exit(1);
// }

// Option 2: Using IIFE (if top-level await is not supported)
/*
(async () => {
    try {
        await main();
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
})();
*/

// Option 3: Using promise catch (alternative approach)
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});

