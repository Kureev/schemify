"use strict";
exports.__esModule = true;
var ts = require("typescript");
/**
 * Checks if given node is exported or not.
 * @param node A node that needs to be examined
 */
function isExported(node) {
    var modifiers = node.modifiers;
    if (modifiers == undefined) {
        return false;
    }
    for (var _i = 0, modifiers_1 = modifiers; _i < modifiers_1.length; _i++) {
        var modifier = modifiers_1[_i];
        if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
            return true;
        }
    }
    return false;
}
exports.isExported = isExported;
