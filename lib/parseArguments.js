// lib/parseArguments.js
import path from 'path';
import chalk from 'chalk';
import minimist from 'minimist';

import STATE from './state.js';
import { VERSION, LICENSE, DOCS, ISSUE, HOMEPAGE } from './constants.js';
import { showHelp } from './help.js';
import { loadConfig } from './loadConfig.js';

/**
 * Parses CLI arguments using minimist.
 * Handles flags like --help, --version, --license, etc.
 * Optionally loads config from file and updates STATE.
 *
 * @returns {Object|null} Parsed options object for non-interactive mode, or null for interactive.
 */
export async function parseArguments() {
    const argv = minimist(process.argv.slice(2), {
        boolean: [
            'help', 'version', 'interactive',
            'exclude-gitignore', 'save-config',
            'license', 'docs', 'issues', 'homepage'
        ],
        string: [
            'path', 'ext', 'pattern',
            'keyword', 'output', 'name',
            'config'
        ],
        alias: {
            h: 'help',
            v: 'version',
            p: 'path',
            e: 'ext',
            k: 'keyword',
            o: 'output',
            c: 'config',
            lic: 'license',
            issue: 'issues'
        },
        default: {
            'exclude-gitignore': true,
            interactive: true
        }
    });

    if (argv.help) {
        showHelp();
        process.exit(0);
    }

    if (argv.version) {
        console.log(`treecat v${VERSION}`);
        process.exit(0);
    }

    if (argv.license) {
        console.log(`License: ${LICENSE}`);
        process.exit(0);
    }

    if (argv.docs) {
        console.log(`Documentation: ${DOCS}`);
        process.exit(0);
    }

    if (argv.issues) {
        console.log(`Issue Tracker: ${ISSUE}`);
        process.exit(0);
    }

    if (argv.homepage) {
        console.log(`Homepage: ${HOMEPAGE}`);
        process.exit(0);
    }

    if (argv.config) {
        try {
            const configPath = path.resolve(argv.config);
            const loadedConfig = await loadConfig(configPath);

            if (!loadedConfig) {
                throw new TreecatError('Config file is empty or invalid', 'CONFIG_EMPTY', { path: configPath });
            }

            STATE.config = loadedConfig;
            console.log(chalk.green(`Loaded config from ${configPath}`));
        } catch (error) {
            console.error(error.toString?.() || error.message);
            process.exit(1);
        }
    }
    STATE.isInteractive = argv.interactive;

    if (!STATE.isInteractive && argv.path) {
        return {
            targetDir: argv.path,
            excludeGitignore: argv['exclude-gitignore'],
            extensions: argv.ext ? argv.ext.split(',').map(e => e.trim()) : [],
            patterns: argv.pattern ? argv.pattern.split(',').map(p => p.trim()) : ['*'],
            keyword: argv.keyword || '',
            outputFormat: argv.output || 'terminal',
            saveConfig: argv['save-config']
        };
    }

    return null;
}
