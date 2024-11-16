import {validatePort} from './no-yargs-commands.js';

describe('validatePort', () => {
    it('should return parsed port when valid port number is provided', async () => {
        const result = await validatePort('3000');
        expect(result).toBe(3000);
    });

    it('should accept port 0', async () => {
        const result = await validatePort('0');
        expect(result).toBe(0);
    });

    it('should accept port 65535', async () => {
        const result = await validatePort('65535');
        expect(result).toBe(65535);
    });

    it('should throw error for non-numeric input', async () => {
        await expect(validatePort('abc'))
            .rejects
            .toThrow('Port must be a number');
    });

    it('should throw error for empty input', async () => {
        await expect(validatePort(''))
            .rejects
            .toThrow('Port must be a number');
    });

    it('should throw error for negative port number', async () => {
        await expect(validatePort('-1'))
            .rejects
            .toThrow('Port must be between 0 and 65535');
    });

    it('should throw error for port number above maximum', async () => {
        await expect(validatePort('65536'))
            .rejects
            .toThrow('Port must be between 0 and 65535');
    });

    it('should throw error for decimal numbers', async () => {
        await expect(validatePort('3000.5'))
            .rejects
            .toThrow('Port must be between 0 and 65535');
    });

    it('should throw error for space-separated numbers', async () => {
        await expect(validatePort('3000 4000'))
            .rejects
            .toThrow('Port must be a number');
    });

    it('should throw error for null input', async () => {
        await expect(validatePort(null))
            .rejects
            .toThrow('Port must be a number');
    });

    it('should throw error for undefined input', async () => {
        await expect(validatePort(undefined))
            .rejects
            .toThrow('Port must be a number');
    });
});
