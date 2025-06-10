import { fsWriteStream } from './deps.js';

/**
 * Creates an output handler for either terminal or file.
 * @param {'terminal'|'file'} type - Type of output.
 * @param {string} [filePath] - File path if output is directed to a file.
 * @returns {{ write: Function, end: Function }} - Output handler with write and end methods.
 */
export function createOutputHandler(type, filePath) {
    if (type === 'terminal') {
        return {
            write: console.log,
            end: () => {}
        };
    } else {
        const stream = fsWriteStream(filePath, { flags: 'a' });
        return {
            write: text => stream.write(text + '\n'),
            end: () => stream.end()
        };
    }
}
