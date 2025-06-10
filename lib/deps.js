/**
 * @fileoverview Centralized external/built-in dependency imports for Treecat CLI.
 * This allows easy mocking and consistent imports across modules.
 */

import fs from 'fs/promises'; // Async FS methods
import path from 'path';
import { fileURLToPath } from 'url';

import inquirer from 'inquirer';
import chalk from 'chalk';
import { createWriteStream as fsWriteStream } from 'fs';

import micromatch from 'micromatch';
import minimist from 'minimist';
import { execSync } from 'child_process';
import archiver from 'archiver';
import crypto from 'crypto';
import readline from 'readline';

export {
	fs,                // from fs/promises
	path,
	fileURLToPath,
	inquirer,
	chalk,
	fsWriteStream,    
	micromatch,
	minimist,
	execSync,
	archiver,
	crypto,
	readline
};
