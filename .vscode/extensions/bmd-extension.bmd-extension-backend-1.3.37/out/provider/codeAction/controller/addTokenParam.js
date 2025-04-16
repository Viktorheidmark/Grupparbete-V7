"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constant_1 = require("../../../constant");
const util_1 = require("./util");
function addTokenParam(document, range) {
    const line = document.lineAt(range.start);
    if (isControllerFile(document) && isUseAuthDecorator(line.text)) {
        const action = new vscode.CodeAction(constant_1.ControllerAction.AddTokenParam, vscode.CodeActionKind.QuickFix);
        action.command = {
            command: constant_1.ControllerAction.AddTokenParam,
            title: 'Add token param 1',
            tooltip: 'Add token param 2',
            arguments: [document, range],
        };
        return action;
    }
    else {
        return undefined;
    }
}
exports.addTokenParam = addTokenParam;
function isUseAuthDecorator(line) {
    return line.includes('@UseAuth');
}
function isControllerFile(document) {
    return document.fileName.includes('Controller');
}
function handleAddTokenParams(document, range) {
    const line = document.lineAt(range.start);
    const edit = new vscode.WorkspaceEdit();
    const template = `        @HeaderParams("token") token: string,
`;
    const lineOpenFunc = util_1.getLineOpenFunction(line, document);
    edit.insert(document.uri, new vscode.Position(lineOpenFunc.lineNumber + 1, 0), template);
    vscode.workspace.applyEdit(edit);
}
exports.handleAddTokenParams = handleAddTokenParams;
//# sourceMappingURL=addTokenParam.js.map