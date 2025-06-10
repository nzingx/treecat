import fs from 'fs/promises';
import { TreecatError } from './errors.js';

/**
 * Safely read a file with size and error checks.
 *
 * This function checks the file size before reading. If the file exceeds `maxFileSize`, it throws
 * a custom error. It also handles common filesystem errors such as permission denied, file not found,
 * and attempts to read a directory.
 *
 * @param {string} filePath - The path to the file to be read.
 * @param {object} [options={}] - Options passed to `fs.readFile`, such as encoding.
 * @param {number} maxFileSize - The maximum allowed file size in bytes.
 * @param {(message: string, code: string, meta: object) => Error} [ErrorClass=TreecatError] - Optional custom error class to throw.
 * @returns {Promise<Buffer|string>} Resolves with file content (as a Buffer or string based on encoding), or rejects with an error.
 *
 * @throws {Error} Throws an instance of `ErrorClass` or propagates unknown errors.
 * @throws {TreecatError} If the file exceeds size limits, is not found, is a directory, or access is denied.
 */
export async function safeReadFile(filePath, options = {}, maxFileSize, ErrorClass = TreecatError) {
	try {
		const stats = await fs.stat(filePath);

		if (stats.size > maxFileSize) {
			throw new ErrorClass('File too large', 'FILE_TOO_LARGE', {
				file: filePath,
				size: stats.size,
				maxAllowed: maxFileSize
			});
		}

		return await fs.readFile(filePath, options);
	} catch (error) {
		if (error.code === 'EACCES') {
			throw new ErrorClass('Permission denied', 'PERMISSION_DENIED', { file: filePath });
		} else if (error.code === 'ENOENT') {
			throw new ErrorClass('File not found', 'FILE_NOT_FOUND', { file: filePath });
		} else if (error.code === 'EISDIR') {
			throw new ErrorClass('Is a directory', 'IS_DIRECTORY', { file: filePath });
		}
		throw error;
	}
}
