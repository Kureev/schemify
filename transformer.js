"use strict";
exports.__esModule = true;
var ts = require("typescript");
var visitors_1 = require("./visitors");
var transformer = function (context) { return function (rootNode) {
    function visit(node) {
        var res;
        if (visitors_1["default"][ts.SyntaxKind[node.kind]] != undefined) {
            res = visitors_1["default"][ts.SyntaxKind[node.kind]](node);
        }
        else {
            res = ts.SyntaxKind[node.kind];
        }
        console.log('Visiting ' + res);
        return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit);
}; };
exports["default"] = transformer;
