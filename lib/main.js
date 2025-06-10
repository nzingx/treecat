import chalk from 'chalk';
import inquirer from 'inquirer';
import { VERSION } from './constants.js';
import STATE from './state.js';
import { parseArguments } from './parseArguments.js';
import { promptForOptions } from './promptForOptions.js';
import { executeScan } from './executeScan.js';
import { showHelp } from './help.js';

/**
 * Main entry function for the treecat CLI.
 *
 * This function handles the overall CLI flow:
 * - Displays version banner.
 * - Parses CLI arguments.
 * - Falls back to interactive prompt if needed.
 * - Executes the file tree scanning process.
 * - Supports an optional rescan loop in interactive mode.
 *
 * It also handles fatal errors gracefully and sets appropriate
 * exit codes based on success or failure of the scan.
 *
 * @async
 * @function main
 * @returns {Promise<void>} Resolves when CLI execution completes or exits.
 *
 * @example
 * // Run from CLI entry point
 * main();
 */
export async function main() {
    try {
        console.log(chalk.blue.bold(`\n🌳 treecat v${VERSION}\n`));

        const cliOptions = await parseArguments();
        let options;

        if (cliOptions) {
            options = cliOptions;
        } else if (STATE.isInteractive) {
            options = await promptForOptions();
        } else {
            showHelp();
            process.exit(1);
        }

        const success = await executeScan(options);

        if (STATE.isInteractive) {
            const { rescan } = await inquirer.prompt([{
                type: 'confirm',
                name: 'rescan',
                message: '🔁 Scan another directory?',
                default: false
            }]);

            if (rescan) {
                await main();
            }
        }

        process.exit(success ? 0 : 1);
    } catch (error) {
        console.error('[DEBUG FULL ERROR]', error);
        console.error(chalk.red.bold('[FATAL]'), error.message);
        process.exit(1);
    }
}
