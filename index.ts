import Transpiler from './src';

const filenames: Array<string> = process.argv.slice(2, process.argv.length);
const schema = new Transpiler(filenames).getSchema();

console.log(JSON.stringify(schema));
