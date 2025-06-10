import { fs, path, chalk } from './deps.js';

/**
 * Save configuration to file
 *
 * @param {string} configPath - Absolute or relative path where the config should be saved.
 * @param {object} config - The configuration object to be written to the file.
 * @param {(message: string, code: string, meta: object) => Error} TreecatError - A custom error class constructor used to throw detailed errors.
 * @returns {Promise<boolean>} Resolves to `true` if the config is saved successfully, otherwise throws a TreecatError.
 */
export async function saveConfig(configPath, config, TreecatError) {
    try {
        await fs.mkdir(path.dirname(configPath), { recursive: true });
        await fs.writeFile(configPath, JSON.stringify(config, null, 2));
        console.log(chalk.green(`Configuration saved to ${configPath}`));
        return true;
    } catch (error) {
        throw new TreecatError('Failed to save config', 'CONFIG_SAVE_FAILED', {
            path: configPath,
            error: error.message
        });
    }
}
