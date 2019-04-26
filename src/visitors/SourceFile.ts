import * as ts from 'typescript';

export default function IdentifierVisitor(node: ts.SourceFile): string {
  return 'file with a name ' + node.fileName;
}
