// lib/generateFileTree.js
import { path } from './deps.js';
import { collectMatchedFiles } from './collectMatchedFiles.js';

/**
 * Generates a directory tree structure from matched files.
 * 
 * @param {string} root - Root directory.
 * @param {string[]} excludeList - Exclusion patterns.
 * @param {string[]} extensions - File extensions to include.
 * @param {string[]} patterns - Filename patterns to match.
 * @returns {Promise<object>} Directory tree object.
 */
export async function generateFileTree(
  root,
  excludeList,
  extensions,
  patterns
) {
  const matched = await collectMatchedFiles(root, excludeList, extensions, patterns);

  const tree = {
    name: path.basename(root),
    type: 'directory',
    children: [],
  };

  matched.forEach(filePath => {
    const relativePath = path.relative(root, filePath);
    if (!relativePath) return;
    const parts = relativePath.split(path.sep).filter(Boolean);
    let currentNode = tree;

    parts.forEach((part, index) => {
      let childNode = currentNode.children.find(child => child.name === part);
      if (!childNode) {
        const isFile = index === parts.length - 1;
        childNode = {
          name: part,
          type: isFile ? 'file' : 'directory',
          ...(isFile ? {} : { children: [] }),
        };
        currentNode.children.push(childNode);
      }

      if (childNode.type === 'directory') {
        currentNode = childNode;
      }
    });
  });

  return tree;
}
