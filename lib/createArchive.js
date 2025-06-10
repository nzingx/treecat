/**
 * @fileoverview Utility to create compressed archive files (e.g., .zip) from a list of files.
 * Part of the Treecat CLI project.
 * @module createArchive
 */

import { path, fsWriteStream, archiver, chalk } from './deps.js';
import { getTimestamp } from './getTimestamp.js';
import { TreecatError } from './errors.js';
import STATE from './state.js';

/**
 * Creates a ZIP archive (or other supported format) from a list of files.
 *
 * @async
 * @function createArchive
 * @param {string[]} files - List of file paths to be included in the archive.
 * @param {string} [format='zip'] - Archive format (e.g., 'zip', 'tar'). Default is 'zip'.
 * @returns {Promise<string>} - Resolves to the path of the resulting archive file.
 * @throws {TreecatError} Throws custom error if archiving fails.
 *
 * @example
 * const archivePath = await createArchive(['./foo.txt', './bar.js']);
 * console.log('Archive created at:', archivePath);
 */
export async function createArchive(files, format = 'zip') {
    const archivePath = path.join(STATE.outputDir, `treecat-archive-${getTimestamp()}.${format}`);
    const output = fsWriteStream(archivePath);
    const archive = archiver(format, {
        zlib: { level: 9 }
    });

    return new Promise((resolve, reject) => {
        output.on('close', () => resolve(archivePath));

        archive.on('warning', err => {
            console.log(chalk.yellow(`[WARN] Archive warning: ${err.message}`));
        });

        archive.on('error', err => reject(
            new TreecatError('Archive creation failed', 'ARCHIVE_FAILED', {
                error: err.message
            })
        ));

        archive.pipe(output);

        files.forEach(file => {
            archive.file(file, {
                name: path.relative(STATE.targetDir, file)
            });
        });

        archive.finalize();
    });
}
