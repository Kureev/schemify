"use strict";
exports.__esModule = true;
function IdentifierVisitor(node) {
    return 'identifier with a name ' + node.escapedText;
}
exports["default"] = IdentifierVisitor;
