import chalk from 'chalk';

export class TreecatError extends Error {
	constructor(message, code, details = {}) {
		super(message);
		this.name = 'TreecatError';
		this.code = code;
		this.details = details;
		this.timestamp = new Date().toISOString();
	}

	toString() {
		const code = this.code ?? 'UNKNOWN';
		const filePath = this.details?.path ?? 'N/A';
		return `${chalk.red.bold('[ERROR]')} ${this.message} (code: ${code}, path: ${filePath})`;
	}

}
