import path from 'path';
import { DEFAULT_CONFIG } from './constants.js';

/**
 * @typedef {Object} Stats
 * @property {number} filesProcessed - Number of files that have been processed.
 * @property {number} directoriesScanned - Number of directories that have been scanned.
 * @property {number} matchesFound - Number of matches found based on filters.
 * @property {number} startTime - Timestamp when the process started.
 * @property {number} endTime - Timestamp when the process ended.
 */

/**
 * @typedef {Object} Config
 * @property {string[]} extensions - File extensions to include during scanning.
 * @property {string[]} ignorePatterns - Glob patterns to ignore (e.g., from .gitignore).
 * @property {string[]} namePatterns - Regex or glob patterns for matching file names.
 * @property {string} outputFormat - Output format: "txt", "md", or "json".
 * @property {boolean} useGitignore - Whether to respect .gitignore rules.
 */

/**
 * @typedef {Object} State
 * @property {string} targetDir - Directory to scan.
 * @property {string} outputDir - Directory where output files will be stored.
 * @property {string} outputFile - Output file name (if saving to file).
 * @property {'terminal'|'file'} saveTo - Output destination: terminal or file.
 * @property {string} keyword - Optional keyword for filtering or highlighting.
 * @property {string[]} errorLog - List of errors encountered during execution.
 * @property {Stats} stats - Runtime statistics.
 * @property {Config} config - Effective configuration used during the process.
 * @property {boolean} isInteractive - Whether the CLI is running in interactive mode.
 */

/** @type {State} */
const STATE = {
	targetDir: process.cwd(),
	outputDir: path.join(process.cwd(), 'output-treecat'),
	outputFile: '',
	saveTo: 'terminal',
	keyword: '',
	errorLog: [],
	stats: {
		filesProcessed: 0,
		directoriesScanned: 0,
		matchesFound: 0,
		startTime: 0,
		endTime: 0
	},
	config: {
		...DEFAULT_CONFIG
	},
	isInteractive: true
};

export default STATE;
