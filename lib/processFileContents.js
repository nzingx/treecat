import { safeReadFile } from './safeReadFile.js';
import STATE from './state.js';
import { chalk } from './deps.js';

/**
 * Reads and processes file content, highlighting keywords if present.
 * @param {string} filePath - Path to the file.
 * @param {Function} outputFn - Function to handle output (e.g., log to terminal or write to file).
 * @returns {Promise<object>} - Processing result: { success, content } or { success, error }
 */
export async function processFileContents(filePath, outputFn) {
    try {
        let content = await safeReadFile(filePath, STATE.config.encoding);

        if (STATE.keyword) {
            const regex = new RegExp(STATE.keyword, 'gi');
            content = content.replace(regex, match => chalk.bgYellow.black(match));
            STATE.stats.matchesFound += (content.match(regex) || []).length;
        }

        outputFn(`\n${chalk.underline(filePath)}`);
        outputFn('-'.repeat(filePath.length));
        outputFn(content);
        outputFn('='.repeat(60));

        return {
            success: true,
            content
        };
    } catch (error) {
        STATE.errorLog.push({
            file: filePath,
            error: error.message,
            timestamp: new Date().toISOString()
        });

        outputFn(`\n${chalk.red.bold('[ERROR]')} ${filePath}`);
        outputFn(chalk.red(error.message));
        outputFn('='.repeat(60));

        return {
            success: false,
            error
        };
    }
}
