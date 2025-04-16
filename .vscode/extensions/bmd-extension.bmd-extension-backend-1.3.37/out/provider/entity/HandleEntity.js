"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constant_1 = require("../../constant");
function createExportInterface(document, range) {
    const action = new vscode.CodeAction(constant_1.EntityAction.ExportInterface, vscode.CodeActionKind.QuickFix);
    action.command = {
        command: constant_1.EntityAction.ExportInterface,
        title: constant_1.EntityAction.ExportInterface,
        tooltip: constant_1.EntityAction.ExportInterface,
        arguments: [document, range]
    };
    return action;
}
exports.createExportInterface = createExportInterface;
//# sourceMappingURL=handleEntity.js.map