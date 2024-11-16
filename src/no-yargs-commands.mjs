import { newNote, getAllNotes, findNotes, removeNote, removeAllNotes } from './notes.mjs'
import { listNotes } from './utils.mjs'
import { start } from './server.mjs'
import {CommandError} from './commands/CommandError.mjs';
import {parseTagsOption, printUsage, validateId, validateNoteContent, validatePort} from './commands/utils.mjs';


const args = process.argv.slice(2);
const command = args[0];

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

