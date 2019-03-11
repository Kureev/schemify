"use strict";
exports.__esModule = true;
var ts = require("typescript");
var utils_1 = require("./utils");
var FILE_NAME = './sandbox/SomeComponent.tsx';
var program = ts.createProgram([FILE_NAME], {});
var checker = program.getTypeChecker();
function visit(node) {
    if (ts.isFunctionDeclaration(node)) {
        var functionDeclaration = node;
        /**
         * We assume that an examined TypeScript module exports
         * a react component, therefore we are looking for a combination
         * of attributes: it should be a function (or a class declaration,
         * but we check it later in the code) with the ExportKeyword modifier.
         */
        if (utils_1.isExported(functionDeclaration)) {
            for (var _i = 0, _a = functionDeclaration.parameters; _i < _a.length; _i++) {
                var param = _a[_i];
                console.log(checker.getTypeAtLocation(param).getSymbol());
            }
        }
    }
    else {
        console.log(ts.SyntaxKind[node.kind]);
    }
}
for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
    var sourceFile = _a[_i];
    if (!sourceFile.isDeclarationFile) {
        ts.forEachChild(sourceFile, visit);
    }
}
