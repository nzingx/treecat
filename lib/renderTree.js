/**
 * Renders the file tree structure to a given output (terminal, file, etc.)
 *
 * This function recursively prints a visual tree structure of a directory,
 * using ASCII-style prefixes like `├──` and `└──`. It supports both terminal
 * and custom output functions such as `stream.write`.
 *
 * @param {object} node - The root or current node in the directory tree. Each node should have a `name` and optional `children` array.
 * @param {string} [prefix=''] - The visual prefix used for indentation at the current tree level.
 * @param {(line: string) => void} outputFn - A function to handle each line of output (e.g., `console.log`, `writeStream.write`).
 *
 * @returns {void}
 *
 * @example
 * renderTree(treeData, '', console.log);
 */
export function renderTree(node, prefix = '', outputFn) {
    const children = node.children || [];
    children.forEach((child, index) => {
        const isLast = index === children.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const newPrefix = isLast ? '    ' : '│   ';

        outputFn(prefix + connector + child.name);

        if (child.children) {
            renderTree(child, prefix + newPrefix, outputFn);
        }
        if (!child || typeof child !== 'object') {
            outputFn(prefix + chalk.red(`[INVALID NODE: ${JSON.stringify(child)}]`));
            return;
        }
    });
}
