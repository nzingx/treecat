import { chalk } from './deps.js';
import { safeReadFile } from './safeReadFile.js';
import { TreecatError } from './errors.js';
import { DEFAULT_CONFIG, VERSION } from './constants.js';

/**
 * Loads and parses config JSON file with fallback and validation.
 * @param {string} configPath - Path to config file.
 * @param {function} safeReadFile - The safe file reader function.
 * @param {object} DEFAULT_CONFIG - Default configuration to fallback to.
 * @param {string} VERSION - Current version for compatibility check.
 * @param {function} TreecatError - Custom error class.
 * @returns {Promise<object|null>}
 */
export async function loadConfig(configPath) {
    try {
        const content = await safeReadFile(configPath);
        const config = JSON.parse(content);

        if (config.version !== VERSION) {
            console.log(chalk.yellow(`[WARN] Config version ${config.version} differs from current ${VERSION}`));
        }

        return {
            ...DEFAULT_CONFIG,
            ...config
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(chalk.yellow(`[INFO] Config file not found, using default config.`));
            return { ...DEFAULT_CONFIG };
        }
        throw new TreecatError('Invalid config file', 'INVALID_CONFIG', {
            path: configPath,
            error: error.message
        });
    }
}
