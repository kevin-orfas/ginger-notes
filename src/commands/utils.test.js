import {validatePort} from './utils.mjs';
import {CommandError} from './CommandError.mjs';

describe('validatePort', () => {
    it('should accept valid port numbers', async () => {
        expect(await validatePort('3000')).toBe(3000);
        expect(await validatePort('0')).toBe(0);
        expect(await validatePort('65535')).toBe(65535);
    });

    it('should throw error for null input', async () => {
        await expect(validatePort(null)).rejects.toThrow(Error);
        await expect(validatePort(null)).rejects.toThrow('Port must be a number');
    });

    it('should throw error for undefined input', async () => {
        await expect(validatePort(undefined)).rejects.toThrow(Error);
        await expect(validatePort(undefined)).rejects.toThrow(
            'Port must be a number',
        );
    });

    it('should throw error for empty input', async () => {
        await expect(validatePort('')).rejects.toThrow(Error);
        await expect(validatePort('')).rejects.toThrow('Port must be a number');
    });

    it('should throw CommandError for non-numeric input', async () => {
        await expect(validatePort('abc')).rejects.toThrow(CommandError);
        await expect(validatePort('abc')).rejects.toThrow('Port must be a number');
    });

    it('should throw error for negative port number', async () => {
        await expect(validatePort('-1')).rejects.toThrow(CommandError);
        await expect(validatePort('-1')).rejects.toThrow(
            'Port must be between 0 and 65535',
        );
    });

    it('should throw error for port number above maximum', async () => {
        await expect(validatePort('65536')).rejects.toThrow(CommandError);
        await expect(validatePort('65536')).rejects.toThrow(
            'Port must be between 0 and 65535',
        );
    });

    it('should throw error for decimal numbers', async () => {
        await expect(validatePort('3000.5')).rejects.toThrow(CommandError);
        await expect(validatePort('3000.5')).rejects.toThrow(
            'Port must be between 0 and 65535',
        );
    });

    it('should throw error for space-separated numbers', async () => {
        await expect(validatePort('3000 4000')).rejects.toThrow(CommandError);
        await expect(validatePort('3000 4000')).rejects.toThrow(
            'Port must be a number',
        );
    });
});
