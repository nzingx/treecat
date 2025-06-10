import { fs, path, chalk } from './deps.js';
import STATE from './state.js';
import { TreecatError } from './errors.js';
import { getTimestamp } from './getTimestamp.js';
import { clearLine } from './clearLine.js';
import { saveConfig } from './saveConfig.js';
import { readGitignore } from './readGitignore.js';
import { collectMatchedFiles } from './collectMatchedFiles.js';
import { generateFileTree } from './generateFileTree.js';
import { renderTree } from './renderTree.js';
import { processFileContents } from './processFileContents.js';
import { createOutputHandler } from './outputHandler.js';
import { createArchive } from './createArchive.js';

/**
 * Executes the full scan process with debug logs.
 * @param {Object} options - Options selected via CLI or interactive prompt.
 * @returns {Promise<boolean>} - True if scan succeeded, false otherwise.
 */
export async function executeScan(options) {
	console.debug('[DEBUG] executeScan() called with options:', options);

	STATE.stats.startTime = Date.now();

	try {
		STATE.targetDir = path.resolve(options.targetDir);
		console.debug('[DEBUG] targetDir resolved to:', STATE.targetDir);

		STATE.config = {
			...STATE.config,
			targetDir: STATE.targetDir,
			excludeGitignore: options.excludeGitignore,
			extensions: options.extensions,
			patterns: options.patterns,
			keyword: options.keyword,
			outputChoice: options.outputFormat
		};
		console.debug('[DEBUG] STATE.config updated:', STATE.config);

		if (options.outputFormat !== 'terminal') {
			await fs.mkdir(STATE.outputDir, { recursive: true });
			STATE.outputFile = path.join(
				STATE.outputDir,
				`treecat-${getTimestamp()}.${options.outputFormat}`
			);
			STATE.saveTo = options.outputFormat;
			console.debug('[DEBUG] outputFile created at:', STATE.outputFile);
		}

		const excludeList = options.excludeGitignore
			? await readGitignore(path.join(STATE.targetDir, '.gitignore'))
			: [];
		console.debug('[DEBUG] Exclude list:', excludeList);

		const outputHandler = createOutputHandler(STATE.saveTo, STATE.outputFile);
		outputHandler.write(`# Treecat Scan Report - ${new Date().toISOString()}`);
		outputHandler.write(`# Target: ${STATE.targetDir}\n`);

		console.log(chalk.blue('\nScanning directory structure...'));
		const tree = await generateFileTree(
			STATE.targetDir,
			excludeList,
			options.extensions,
			options.patterns
		);

		outputHandler.write('\n## Directory Structure\n');
		outputHandler.write('```');
		outputHandler.write(tree.name);
		renderTree(tree, '', outputHandler.write);
		outputHandler.write('```\n');

		const files = await collectMatchedFiles(
			STATE.targetDir,
			excludeList,
			options.extensions,
			options.patterns
		);

		console.debug('[DEBUG] Files matched:', files.length);

		if (files.length > 0) {
			console.log(chalk.blue(`\nProcessing ${files.length} files...`));
			outputHandler.write('\n## File Contents\n');

			for (const file of files) {
				clearLine();
				process.stdout.write(`Processing: ${path.basename(file)}`);
				await processFileContents(file, outputHandler.write);
			}

			clearLine();
			console.log(chalk.green(`Processed ${files.length} files successfully`));
		} else {
			outputHandler.write('\nNo matching files found\n');
			console.log(chalk.yellow('No matching files found'));
		}

		STATE.stats.endTime = Date.now();
		const duration = (STATE.stats.endTime - STATE.stats.startTime) / 1000;

		outputHandler.write('\n## Scan Statistics\n');
		outputHandler.write('```');
		outputHandler.write(`Directories scanned: ${STATE.stats.directoriesScanned}`);
		outputHandler.write(`Files processed:     ${STATE.stats.filesProcessed}`);
		outputHandler.write(`Keyword matches:     ${STATE.stats.matchesFound}`);
		outputHandler.write(`Errors encountered:  ${STATE.errorLog.length}`);
		outputHandler.write(`Processing time:     ${duration.toFixed(2)} seconds`);
		outputHandler.write('```\n');

		if (STATE.errorLog.length > 0) {
			const errorLogPath = path.join(
				STATE.outputDir,
				`treecat-errors-${getTimestamp()}.log`
			);
			await fs.writeFile(
				errorLogPath,
				STATE.errorLog.map(e => `${e.timestamp} | ${e.file}: ${e.error}`).join('\n')
			);
			console.log(chalk.yellow(`\nErrors logged to: ${errorLogPath}`));
		}

		if (STATE.saveTo !== 'terminal') {
			outputHandler.end();
			console.log(chalk.green(`\nOutput saved to: ${STATE.outputFile}`));

			if (files.length > 10) {
				const archivePath = await createArchive(files);
				console.log(chalk.green(`Files archived to: ${archivePath}`));
			}
		}

		if (options.saveConfig) {
			const configPath = path.join(STATE.targetDir, '.treecatrc.json');
			console.debug('[DEBUG] Saving config to:', configPath);
			await saveConfig(configPath, STATE.config, TreecatError);
		}

		console.debug('[DEBUG] executeScan() completed successfully');
		return true;
	} catch (error) {
		console.debug('[DEBUG] executeScan() threw error:', error);
		if (error instanceof TreecatError) {
			console.error(error.toString());
		} else {
			console.error(chalk.red.bold('[FATAL]'), error?.message || error);
		}
		return false;
	}
}
