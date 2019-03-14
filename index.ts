import * as ts from 'typescript';
import { findNativeModuleTypeNode } from './utils';

const FILE_NAME: string = './sandbox/SomeComponent.tsx';

function delint(program: ts.Program) {
  const checker = program.getTypeChecker();
  const node = findNativeModuleTypeNode(program, checker);

  const type = checker.getTypeAtLocation(node);
  type.symbol.members.forEach((value, key) => {
    const foo = checker.getTypeAtLocation(value.valueDeclaration);
    console.log(key, ' : ', checker.typeToString(foo));
  });
}

const program = ts.createProgram([FILE_NAME], {
  noEmitOnError: true,
  noImplicitAny: true,
  target: ts.ScriptTarget.ES5,
});

delint(program);
