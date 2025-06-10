#  treecat - Interactive Directory Structure and Content Scanner

[![License](https://img.shields.io/badge/License-EVL-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.1-green.svg)](https://github.com/nzingx/treecat)

`treecat` is a powerful CLI tool that combines directory tree visualization with file content preview capabilities. It works in both interactive and non-interactive modes, perfect for developers who need to quickly explore project structures or document codebases.

##  Features

- **Interactive & Non-interactive Modes**: Choose between guided prompts or CLI arguments
- **Smart Filtering**:
  - Filter by file extensions (`.js`, `.md`, etc.)
  - Match filename patterns (`*.spec.js`, `test-*.ts`)
  - Respect `.gitignore` rules
- **Content Inspection**:
  - Highlight keywords in file contents
  - Preview files directly in terminal
- **Multiple Output Formats**:
  - Terminal display with syntax highlighting
  - Export to TXT, Markdown, JSON, and HTML
  - Generate ZIP archives of scanned files
- **Configuration**:
  - Save and reuse scan configurations
  - Customizable file size limits
- **Performance Tracking**:
  - Scan statistics and timing
  - Error logging for unreadable files

##  Installation

### Using npm (global installation)
```bash
npm install -g treecat
```

### Using yarn
```bash
yarn global add treecat
```

### From source
```bash
git clone https://github.com/nzingx/treecat.git
cd treecat
npm install
npm link
```

##  Usage

### Interactive Mode (default)
```bash
treecat
```
Follow the interactive prompts to configure your scan.

### Non-interactive Mode
```bash
treecat --path ./src --ext .js,.jsx --keyword TODO --output md
```

### Common Options
| Option | Description |
|--------|-------------|
| `-p, --path <dir>` | Target directory to scan |
| `-e, --ext <extensions>` | Comma-separated file extensions |
| `--pattern <patterns>` | Filename patterns (glob) |
| `-k, --keyword <text>` | Highlight keyword in contents |
| `-o, --output <format>` | Output format (txt, md, json, html) |
| `--exclude-gitignore` | Respect .gitignore rules (default: true) |
| `--save-config` | Save current settings |
| `-c, --config <path>` | Load config from file |

### Info Commands
```bash
treecat --version       # Show version
treecat --license       # Show license
treecat --docs          # Open documentation
treecat --issues        # View issue tracker
```

##  Configuration

Example `.treecatrc.json`:
```json
{
  "version": "1.0.1",
  "targetDir": "./src",
  "excludeGitignore": true,
  "extensions": [".js", ".jsx"],
  "patterns": ["*"],
  "keyword": "TODO",
  "outputChoice": "md",
  "maxFileSize": 1048576,
  "encoding": "utf-8"
}
```

##  Sample Output

### Directory Tree
```
project/
 src/
    index.js
    utils/
        helper.js
 tests/
     index.spec.js
```

### File Content Preview
```markdown
# File: src/index.js
--------------------
import React from 'react';
// TODO: Add error boundary
const App = () => {...};
```

##  Project Structure
```
treecat/
├── bin
│   └── treecat.mjs
├── lib
│   ├── clearLine.js
│   ├── collectMatchedFiles.js
│   ├── constants.js
│   ├── createArchive.js
│   ├── deps.js
│   ├── errors.js
│   ├── executeScan.js
│   ├── formatBytes.js
│   ├── generateFileTree.js
│   ├── getTimestamp.js
│   ├── help.js
│   ├── loadConfig.js
│   ├── main.js
│   ├── outputHandler.js
│   ├── parseArguments.js
│   ├── processFileContents.js
│   ├── promptForOptions.js
│   ├── readGitignore.js
│   ├── renderTree.js
│   ├── safeReadFile.js
│   ├── saveConfig.js
│   └── state.js
├── LICENSE
├── package.json
└── README.md
```

##  License
This project is licensed under the EVL License. See [LICENSE](LICENSE) for details.

##  Support
Found a bug or have a feature request? Please [open an issue](https://github.com/nzingx/treecat/issues).

---
Developed with  by [nzingx](https://github.com/nzingx)
```