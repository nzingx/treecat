import { fs, path, micromatch } from './deps.js';
import { TreecatError } from './errors.js';
import STATE from './state.js';

/**
 * Recursively collects files that match criteria from a directory.
 * 
 * @param {string} dir - Root directory
 * @param {string[]} excludeList - Patterns to exclude
 * @param {string[]} extensions - Allowed file extensions
 * @param {string[]} patterns - Filename patterns to match
 * @param {string[]} [matched=[]] - Resulting matched files array
 * @returns {Promise<string[]>}
 */
export async function collectMatchedFiles(
    dir,
    excludeList,
    extensions,
    patterns,
    matched = []
) {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (excludeList.some(pattern => micromatch.isMatch(fullPath, pattern))) {
                continue;
            }

            if (entry.isDirectory()) {
                STATE.stats.directoriesScanned++;
                await collectMatchedFiles(fullPath, excludeList, extensions, patterns, matched);
            } else if (entry.isFile()) {
                STATE.stats.filesProcessed++;

                const hasExtension =
                    extensions.length === 0 || extensions.some(ext => entry.name.endsWith(ext));
                const matchesPattern =
                    patterns.length === 0 || micromatch.isMatch(entry.name, patterns);

                if (hasExtension && matchesPattern) {
                    matched.push(fullPath);
                }
            }
        }

        return matched;
    } catch (error) {
        throw new TreecatError('Directory scan failed', 'DIRECTORY_SCAN_FAILED', {
            directory: dir,
            error: error.message
        });
    }
}
