import Transpiler from './src';
import * as fs from 'fs';

const [outfile, ...filenames]: Array<string> = process.argv.slice(2);
const schema = new Transpiler(filenames).getSchema();

const formattedSchema = JSON.stringify(schema, null, 2);
if (outfile == null) {
  throw Error(
    'Schemify requires two parameters: <outfile> <array of filenames>'
  );
}
fs.writeFileSync(outfile, formattedSchema);
