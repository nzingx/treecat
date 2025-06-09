# treecat

**treecat** is an interactive CLI tool that displays folder structures like the `tree` command and optionally shows file contents like `cat`.

## Features

- Display folder structure in a tree-like format.
- Supports `.gitignore` rules to exclude files/folders.
- Filter files by extension or name pattern.
- Optionally preview file contents interactively.
- Export output to terminal, `.txt`, `.md`, or `.json`.

## Installation

No global installation required. Run directly using `npx`:

```bash
npx treecat
````

## Usage

After running the command, follow the interactive prompts:

1. Select the root folder to scan.
2. Apply optional filters (extensions or filename patterns).
3. Choose whether to show file contents.
4. Select output format and destination.

Output will be shown in the terminal or saved to the `output-treecat/` directory.

## Example Output

```plaintext
.
├── bin
│   └── treecat.mjs
├── lib
│   ├── reader.js
│   └── writer.js
└── output-treecat
    └── tree.result.txt
```

## License

[EVL](./LICENSE) nzingx 2025 
