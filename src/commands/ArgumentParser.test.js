import ArgumentParser from './ArgumentParser.mjs'

describe('ArgumentParser', () => {
    describe('Command parsing', () => {
        test('should correctly parse command name', () => {
            const parser = new ArgumentParser(['new', 'Buy milk']);
            expect(parser.getCommand()).toBe('new');
        });
    });

    describe('Positional arguments', () => {
        test('should parse single positional argument', () => {
            const parser = new ArgumentParser(['new', 'Buy milk']);
            expect(parser.getPositional(0)).toBe('Buy milk');
        });

        test('should handle multiple positional arguments', () => {
            const parser = new ArgumentParser(['new', 'Buy', 'milk', 'today']);
            expect(parser.getPositional(0)).toBe('Buy');
            expect(parser.getPositional(1)).toBe('milk');
            expect(parser.getPositional(2)).toBe('today');
        });

        test('should return undefined for non-existent positional index', () => {
            const parser = new ArgumentParser(['new', 'Buy milk']);
            expect(parser.getPositional(5)).toBeUndefined();
        });
    });

    describe('Option parsing', () => {
        test('should parse long options with values', () => {
            const parser = new ArgumentParser(['new', '--tags', 'shopping,home']);
            expect(parser.getOption('tags')).toBe('shopping,home');
        });

        test('should parse short options with values', () => {
            const parser = new ArgumentParser(['new', '-t', 'shopping,home']);
            expect(parser.getOption('tags')).toBe('shopping,home');
        });

        test('should handle flag options without values', () => {
            const parser = new ArgumentParser(['find', '--case-sensitive']);
            expect(parser.getOption('case-sensitive')).toBe(true);
        });

        test('should return default value for non-existent options', () => {
            const parser = new ArgumentParser(['new']);
            expect(parser.getOption('tags', 'default')).toBe('default');
        });

        test('should handle multiple options', () => {
            const parser = new ArgumentParser(['new', '--tags', 'shopping', '--priority', '2']);
            expect(parser.getOption('tags')).toBe('shopping');
            expect(parser.getOption('priority')).toBe('2');
        });
    });

    describe('Number option parsing', () => {
        test('should parse numeric options', () => {
            const parser = new ArgumentParser(['new', '--priority', '2']);
            expect(parser.getNumberOption('priority')).toBe(2);
        });

        test('should return default value for non-numeric options', () => {
            const parser = new ArgumentParser(['new', '--priority', 'high']);
            expect(parser.getNumberOption('priority', 1)).toBe(1);
        });

        test('should return default value for missing options', () => {
            const parser = new ArgumentParser(['new']);
            expect(parser.getNumberOption('priority', 1)).toBe(1);
        });
    });

    describe('Array option parsing', () => {
        test('should parse comma-separated values', () => {
            const parser = new ArgumentParser(['new', '--tags', 'shopping,home,urgent']);
            expect(parser.getArrayOption('tags')).toEqual(['shopping', 'home', 'urgent']);
        });

        test('should handle custom separators', () => {
            const parser = new ArgumentParser(['new', '--tags', 'shopping;home;urgent']);
            expect(parser.getArrayOption('tags', ';')).toEqual(['shopping', 'home', 'urgent']);
        });

        test('should return default value for missing options', () => {
            const parser = new ArgumentParser(['new']);
            expect(parser.getArrayOption('tags', ',', ['default'])).toEqual(['default']);
        });

        test('should handle empty array options', () => {
            const parser = new ArgumentParser(['new', '--tags', '']);
            expect(parser.getArrayOption('tags')).toEqual(['']);
        });
    });

    describe('Edge cases', () => {
        test('should handle empty arguments array', () => {
            const parser = new ArgumentParser([]);
            expect(parser.getCommand()).toBeUndefined();
        });

        test('should handle options at the end without values', () => {
            const parser = new ArgumentParser(['new', 'Buy milk', '--priority']);
            expect(parser.getOption('priority')).toBe(true);
        });

        test('should handle multiple consecutive options', () => {
            const parser = new ArgumentParser(['new', '--flag1', '--flag2']);
            expect(parser.getOption('flag1')).toBe(true);
            expect(parser.getOption('flag2')).toBe(true);
        });

        test('should handle mixed short and long options', () => {
            const parser = new ArgumentParser(['new', '-t', 'shopping', '--priority', '2']);
            expect(parser.getOption('tags')).toBe('shopping');
            expect(parser.getOption('priority')).toBe('2');
        });
    });

    describe('Integration tests', () => {
        test('should handle new command with all options', () => {
            const parser = new ArgumentParser([
                'new',
                'Buy milk',
                '--tags', 'shopping,home',
                '--priority', '2'
            ]);

            expect(parser.getCommand()).toBe('new');
            expect(parser.getPositional(0)).toBe('Buy milk');
            expect(parser.getArrayOption('tags')).toEqual(['shopping', 'home']);
            expect(parser.getNumberOption('priority')).toBe(2);
        });

        test('should handle find command with case-sensitive flag', () => {
            const parser = new ArgumentParser([
                'find',
                'milk',
                '--case-sensitive'
            ]);

            expect(parser.getCommand()).toBe('find');
            expect(parser.getPositional(0)).toBe('milk');
            expect(parser.getOption('case-sensitive')).toBe(true);
        });
    });
});
