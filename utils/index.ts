import * as ts from 'typescript';

/**
 * Checks if given node is exported or not.
 * @param node A node that needs to be examined
 */
export function isExported(node: ts.Node): boolean {
  const { modifiers } = node;
  if (modifiers == undefined) {
    return false;
  }

  for (const modifier of modifiers) {
    if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
      return true;
    }
  }

  return false;
}
