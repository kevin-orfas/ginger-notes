class CommandError extends Error {
    constructor(message, showUsage = false) {
        super(message);
        this.name = 'CommandError';
        this.showUsage = showUsage;
    }
}

async function validatePort(port) {
    // Check for empty input first
    if (!port) {
        throw new Error("Port must be a number");
    }

    const parsedPort = Number(port);

    // Check if the parsed value is NaN (non-numeric input)
    if (isNaN(parsedPort)) {
        throw new CommandError("Port must be a number");
    }

    // Check if the number is an integer
    if (!Number.isInteger(parsedPort)) {
        throw new CommandError("Port must be between 0 and 65535");
    }

    // Check if the port is within valid range
    if (parsedPort < 0 || parsedPort > 65535) {
        throw new CommandError("Port must be between 0 and 65535");
    }

    return parsedPort;
}

export {validatePort};
