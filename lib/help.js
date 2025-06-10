import chalk from 'chalk';
import { VERSION } from './constants.js';

/**
 * Displays help information for the treecat CLI tool.
 */
export function showHelp() {
    console.log(`
${chalk.blue.bold('treecat - Directory Structure and Content Scanner')} v${VERSION}

${chalk.underline('Usage:')}
  treecat [options]

${chalk.underline('Options:')}
  -h, --help              Show this help message
  -v, --version           Show version information
  --lic, --license        Show license information
  --docs                  Show documentation URL
  --issue, --issues       Show issue tracker URL
  --homepage              Show project homepage URL
  -p, --path <dir>        Target directory to scan
  -e, --ext <extensions>  Comma-separated file extensions to include
  --pattern <patterns>    Comma-separated filename patterns to match
  -k, --keyword <text>    Keyword to highlight in files
  -o, --output <format>   Output format (txt, md, json, html)
  --name <filename>       Custom output filename (without extension)
  --exclude-gitignore     Exclude .gitignore patterns (default: true)
  --save-config           Save current settings as default
  -c, --config <path>     Load configuration from specified file
  --interactive           Run in interactive mode (default: true)

${chalk.underline('Examples:')}
  treecat -p ./src -e .js,.jsx -k "TODO"
  treecat --path ./tests --pattern *.spec.js --output md
  treecat --config ./custom-config.json
  treecat --license
  treecat --docs
`);
}
