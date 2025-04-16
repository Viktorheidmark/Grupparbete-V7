"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constant_1 = require("../../../constant");
function createPropertyAction(document, range) {
    if (isEntityProperties(document, range)) {
        const addProperty = createAddPropertyAction(document, range);
        return [addProperty];
    }
    return [];
}
exports.createPropertyAction = createPropertyAction;
function createAddPropertyAction(document, range) {
    const entity = new vscode.CodeAction(constant_1.EntityAction.AddProperty, vscode.CodeActionKind.QuickFix);
    entity.command = {
        command: constant_1.EntityAction.AddProperty,
        title: 'Add property: ',
        tooltip: 'Add property: ',
        arguments: [document]
    };
    return entity;
}
function isEntityProperties(document, range) {
    const start = range.start;
    const line = document.lineAt(start.line);
    return line.text.includes('PROPERTIES') && document.fileName.includes('entity/');
}
//# sourceMappingURL=handleProperty.js.map