import Transpiler from './src';

const FILE_NAME: string = './sandbox/SomeComponent.tsx';
const output = new Transpiler(FILE_NAME).getSchema();

console.log(output);
