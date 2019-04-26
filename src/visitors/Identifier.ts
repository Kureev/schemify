import * as ts from 'typescript';

export default function IdentifierVisitor(node: ts.Identifier): string {
  return 'identifier with a name ' + node.escapedText;
}
