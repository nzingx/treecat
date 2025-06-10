import { chalk } from './deps.js';
import { safeReadFile } from './safeReadFile.js';

/**
 * @param {string} gitignorePath 
 * @param {function} safeReadFile 
 * @returns {Promise<string[]>}
 */
export async function readGitignore(gitignorePath) {
    try {
        const content = await safeReadFile(gitignorePath, 'utf-8');
        return content
            .split(/\r?\n/)
            .filter(line => line.trim() && !line.trim().startsWith('#'))
            .map(line => line.trim());
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(chalk.yellow('[INFO] .gitignore not found'));
            return [];
        }
        throw error;
    }
}