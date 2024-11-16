import {CommandError} from './CommandError.mjs';

const validatePort = async (port) => {
    // Check for empty input first
    if (!port) {
        throw new Error('Port must be a number');
    }

    const parsedPort = Number(port);

    // Check if the parsed value is NaN (non-numeric input)
    if (isNaN(parsedPort)) {
        throw new CommandError('Port must be a number');
    }

    // Check if the number is an integer
    if (!Number.isInteger(parsedPort)) {
        throw new CommandError('Port must be between 0 and 65535');
    }

    // Check if the port is within valid range
    if (parsedPort < 0 || parsedPort > 65535) {
        throw new CommandError('Port must be between 0 and 65535');
    }

    return parsedPort;
};

const validateId = async (id) => {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        throw new CommandError('ID must be a number');
    }
    if (parsedId < 0) {
        throw new CommandError('ID must be a positive number');
    }
    return parsedId;
};

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

export {validatePort, validateId, parseTagsOption, validateNoteContent, printUsage};
