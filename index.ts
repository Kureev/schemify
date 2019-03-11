import * as ts from 'typescript';
import { isExported } from './utils';

const FILE_NAME: string = './sandbox/SomeComponent.tsx';

const program: ts.Program = ts.createProgram([FILE_NAME], {});
const checker = program.getTypeChecker();

function visit(node: ts.Node): void {
  if (ts.isFunctionDeclaration(node)) {
    const functionDeclaration = <ts.FunctionDeclaration>node;
    /**
     * We assume that an examined TypeScript module exports
     * a react component, therefore we are looking for a combination
     * of attributes: it should be a function (or a class declaration,
     * but we check it later in the code) with the ExportKeyword modifier.
     */
    if (isExported(functionDeclaration)) {
      for (const param of functionDeclaration.parameters) {
        console.log(checker.getTypeAtLocation(param).getSymbol());
      }
    }
  } else {
    console.log(ts.SyntaxKind[node.kind]);
  }
}

for (const sourceFile of program.getSourceFiles()) {
  if (!sourceFile.isDeclarationFile) {
    ts.forEachChild(sourceFile, visit);
  }
}
