import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs/promises';
import STATE from './state.js';
import { VERSION, AUTHOR, LICENSE, DOCS, ISSUE, HOMEPAGE } from './constants.js';

/**
 * Displays an interactive prompt and returns user-selected configuration.
 * @returns {Promise<Object>} User-selected options.
 */
export async function promptForOptions() {
    const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            { name: 'Scan directory', value: 'scan' },
            { name: 'Show project information', value: 'info' },
            { name: 'Exit', value: 'exit' }
        ]
    }]);

    if (action === 'info') {
        console.log(chalk.blue.bold('\nProject Information:'));
        console.log(`Version:      ${VERSION}`);
        console.log(`Author:       ${AUTHOR}`);
        console.log(`License:      ${LICENSE}`);
        console.log(`Documentation: ${DOCS}`);
        console.log(`Issue Tracker: ${ISSUE}`);
        console.log(`Homepage:     ${HOMEPAGE}`);

        const { back } = await inquirer.prompt([{
            type: 'confirm',
            name: 'back',
            message: 'Return to main menu?',
            default: true
        }]);

        return back ? promptForOptions() : process.exit(0);
    }

    if (action === 'exit') process.exit(0);

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'targetDir',
            message: 'Target directory:',
            default: STATE.config.targetDir,
            validate: async input => {
                try {
                    const stat = await fs.stat(input);
                    return stat.isDirectory() || 'Path must be a directory';
                } catch {
                    return 'Directory does not exist';
                }
            }
        },
        {
            type: 'confirm',
            name: 'excludeGitignore',
            message: 'Exclude .gitignore patterns?',
            default: STATE.config.excludeGitignore
        },
        {
            type: 'checkbox',
            name: 'extensions',
            message: 'File extensions to include (leave empty for all):',
            choices: [
                { name: '.js', value: '.js' },
                { name: '.mjs', value: '.mjs' },
                { name: '.json', value: '.json' },
                { name: '.html', value: '.html' },
                { name: '.css', value: '.css' },
                { name: '.md', value: '.md' },
                new inquirer.Separator(),
                { name: 'Custom', value: 'custom' }
            ],
            default: STATE.config.extensions
        },
        {
            type: 'input',
            name: 'customExtension',
            message: 'Enter custom extensions (comma separated, include dot):',
            when: answers => answers.extensions.includes('custom'),
            filter: input => input.split(',').map(e => e.trim()).filter(Boolean)
        },
        {
            type: 'input',
            name: 'patterns',
            message: 'Filename patterns to match (e.g., *.spec.js):',
            default: STATE.config.patterns.join(','),
            filter: input => input.split(',').map(p => p.trim()).filter(Boolean)
        },
        {
            type: 'confirm',
            name: 'highlightKeywords',
            message: 'Highlight keywords in files?',
            default: !!STATE.config.keyword
        },
        {
            type: 'input',
            name: 'keyword',
            message: 'Keyword to highlight:',
            when: answers => answers.highlightKeywords,
            default: STATE.config.keyword
        },
        {
            type: 'list',
            name: 'outputFormat',
            message: 'Output format:',
            choices: [
                { name: 'Terminal', value: 'terminal' },
                { name: 'Text file (.txt)', value: 'txt' },
                { name: 'Markdown (.md)', value: 'md' },
                { name: 'JSON (.json)', value: 'json' },
                { name: 'HTML (.html)', value: 'html' }
            ],
            default: STATE.config.outputChoice
        },
        {
            type: 'confirm',
            name: 'saveConfig',
            message: 'Save these settings as default?',
            default: false
        }
    ]);

    const extensions = answers.extensions.includes('custom')
        ? answers.customExtension
        : answers.extensions.filter(e => e !== 'custom');

    return {
        targetDir: answers.targetDir,
        excludeGitignore: answers.excludeGitignore,
        extensions,
        patterns: answers.patterns,
        keyword: answers.keyword,
        outputFormat: answers.outputFormat,
        saveConfig: answers.saveConfig
    };
}
