export default class ArgumentParser {
    /**
     * Creates a new ArgumentParser instance
     * @param {string[]} args - Array of command line arguments
     */
    constructor(args) {
        this.args = args || [];
        this.command = this.args[0];
        this.positionals = [];
        this.options = {};
        this.parseArgs();
    }

    /**
     * Parses command line arguments into positional and named options
     * @private
     */
    parseArgs() {
        let i = 1; // Skip command name
        while (i < this.args.length) {
            const arg = this.args[i];

            if (arg.startsWith('--') || arg.startsWith('-')) {
                // Handle options (--tags or -t)
                const isLongOption = arg.startsWith('--');
                const name = isLongOption ? arg.slice(2) : arg.slice(1);

                // Check if next arg exists and isn't an option
                if (i + 1 < this.args.length && !this.args[i + 1].startsWith('-')) {
                    // Option with value
                    const value = this.args[i + 1];
                    if (isLongOption) {
                        this.options[name] = value;
                    } else {
                        // For short options, store under both short and potential long name
                        // This allows -t and --tags to be accessed the same way
                        this.options[name] = value;
                        // Try to match with a long option name
                        const potentialLongNames = {
                            't': 'tags',
                            'p': 'priority'
                            // Add more mappings as needed
                        };
                        if (potentialLongNames[name]) {
                            this.options[potentialLongNames[name]] = value;
                        }
                    }
                    i += 2; // Skip option value
                } else {
                    // Flag option (no value)
                    this.options[name] = true;
                    i += 1;
                }
            } else {
                // Handle positional arguments
                this.positionals.push(arg);
                i += 1;
            }
        }
    }

    /**
     * Gets the command name
     * @returns {string|undefined} The command name or undefined if no command
     */
    getCommand() {
        return this.command;
    }

    /**
     * Gets a positional argument by index
     * @param {number} index - The index of the positional argument
     * @returns {string|undefined} The positional argument or undefined if not found
     */
    getPositional(index) {
        return this.positionals[index];
    }

    /**
     * Gets an option value by name
     * @param {string} name - The option name
     * @param {*} defaultValue - The default value if option not found
     * @returns {*} The option value or default value
     */
    getOption(name, defaultValue = null) {
        const longOption = this.options[name];
        const shortOption = this.options[name[0]];
        return longOption !== undefined ? longOption :
            shortOption !== undefined ? shortOption :
                defaultValue;
    }

    /**
     * Gets an option value as a number
     * @param {string} name - The option name
     * @param {number} defaultValue - The default value if option not found or not a number
     * @returns {number} The numeric option value or default value
     */
    getNumberOption(name, defaultValue = 0) {
        const value = this.getOption(name);
        if (value === null || value === true) return defaultValue;
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
    }

    /**
     * Gets an option value as an array by splitting on a separator
     * @param {string} name - The option name
     * @param {string} separator - The separator to split on
     * @param {string[]} defaultValue - The default value if option not found
     * @returns {string[]} The array of values or default value
     */
    getArrayOption(name, separator = ',', defaultValue = []) {
        const value = this.getOption(name);
        if (value === null || value === true) return defaultValue;
        return value.split(separator);
    }
}
