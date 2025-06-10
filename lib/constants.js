/**
 * @fileoverview Constants and default configuration used throughout the Treecat CLI.
 * Provides versioning info, author metadata, documentation links, and default runtime config.
 * @module constants
 */

import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Absolute directory name of the current module.
 * Equivalent to `__dirname` in CommonJS.
 * @constant {string}
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Current version of the Treecat CLI.
 * @constant {string}
 */
const VERSION = '1.0.2';

/**
 * Author of the Treecat CLI.
 * @constant {string}
 */
const AUTHOR = 'nzingx';

/**
 * License type for the Treecat CLI.
 * @constant {string}
 */
const LICENSE = 'EVL';

/**
 * Documentation URL for Treecat CLI.
 * @constant {string}
 */
const DOCS = 'https://nzingx.github.io/treecat/';

/**
 * Issue tracker URL on GitHub.
 * @constant {string}
 */
const ISSUE = 'https://github.com/nzingx/treecat/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen';

/**
 * Project homepage URL.
 * @constant {string}
 */
const HOMEPAGE = 'https://github.com/nzingx/treecat';

/**
 * Default configuration object used by Treecat CLI.
 * @typedef {Object} Config
 * @property {string} version - CLI version.
 * @property {string} targetDir - Target directory to scan.
 * @property {boolean} excludeGitignore - Whether to exclude `.gitignore` patterns.
 * @property {string[]} extensions - List of file extensions to include.
 * @property {string[]} patterns - Glob patterns to match filenames.
 * @property {string} keyword - Keyword to highlight in file contents.
 * @property {'terminal' | 'txt' | 'md' | 'json' | 'html'} outputChoice - Output format.
 * @property {string} outputFile - Custom output filename (without extension).
 * @property {boolean} saveConfig - Whether to save config to disk.
 * @property {'default' | string} colorTheme - Color theme for output.
 * @property {number} maxFileSize - Max file size to scan (in bytes).
 * @property {boolean} followSymlinks - Whether to follow symbolic links.
 * @property {string} encoding - File encoding (e.g., 'utf-8').
 */

/**
 * Default runtime configuration values.
 * @constant {Config}
 */
const DEFAULT_CONFIG = {
	version: VERSION,
	targetDir: process.cwd(),
	excludeGitignore: true,
	extensions: [],
	patterns: ['*'],
	keyword: '',
	outputChoice: 'terminal',
	outputFile: '',
	saveConfig: false,
	colorTheme: 'default',
	maxFileSize: 1024 * 1024,
	followSymlinks: false,
	encoding: 'utf-8'
};

export {
	__dirname,
	VERSION,
	AUTHOR,
	LICENSE,
	DOCS,
	ISSUE,
	HOMEPAGE,
	DEFAULT_CONFIG
};
