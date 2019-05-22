Schemify is a TypeScript compiler for React Native CodeGen project. It converts third-party React Native UI components written in TypeScript into a React Native CodeGen Schema that can be further processed by React Native CodeGen.

## Usage
```sh
$ npx schemify output-schema.json path/to/component1 path/to/component2 path/to/componentN
```
This command will create an `output-schema.json` file with a JSON schema, generated from given array of components.

## About Schemify
Schemify is not meant for standalone usage as it generates an intermediate representation of your TypeScript code that should be further processed by [React Native CodeGen](packages/react-native-codegen/src/generators/RNCodegen.js).

This tool is intended to be used under the hood of upcoming `react-native codegen` command for TypeScript files.

## Support
Feel free to reach me out on [Twitter](https://twitter.com/kureevalexey) or file an issue in the repo.
