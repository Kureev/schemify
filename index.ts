import * as ts from 'typescript';
import * as fs from 'fs';
import transformer from './transformer';

const FILE_NAME: string = './sandbox/SomeComponent.tsx';

const content: string = fs.readFileSync(FILE_NAME).toString('utf8');
const sourceFile: ts.SourceFile = ts.createSourceFile(
  FILE_NAME,
  content,
  ts.ScriptTarget.ES2016,
  true,
  ts.ScriptKind.TS
);

ts.transform(sourceFile, [transformer]);
