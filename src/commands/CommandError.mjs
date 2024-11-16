export class CommandError extends Error {
    constructor(message, showUsage = true) {
        super(message);
        this.name = 'CommandError';
        this.showUsage = showUsage;
    }
}
