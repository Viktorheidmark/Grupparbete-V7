"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constant_1 = require("../../constant");
const util_1 = require("../../util");
class ControllerActionProvider {
    provideCodeActions(document, range) {
        const actionAdd = addPathParams(document, range);
        return actionAdd ? [actionAdd] : [];
    }
}
exports.ControllerActionProvider = ControllerActionProvider;
ControllerActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
function addPathParams(document, range) {
    const line = document.lineAt(range.start);
    if (isControllerFile(document) && isMethodDecorator(line.text)) {
        const action = new vscode.CodeAction(constant_1.ControllerAction.AddPathParams, vscode.CodeActionKind.QuickFix);
        action.command = {
            command: constant_1.ControllerAction.AddPathParams,
            title: 'Add @PathParams: ',
            tooltip: 'Add @PathParams: ',
            arguments: [document, range]
        };
        return action;
    }
    else {
        return null;
    }
}
exports.addPathParams = addPathParams;
function isMethodDecorator(line) {
    return line.includes('@Get') ||
        line.includes('@Post') ||
        line.includes('@Delete') ||
        line.includes('@Put') ||
        line.includes('@Patch');
}
function isControllerFile(document) {
    return document.fileName.includes('Controller');
}
function handleAddPathParams(document, range) {
    const line = document.lineAt(range.start);
    const path = getPath(line.text);
    if (!path)
        return vscode.window.showInformationMessage('Cancel: Can not find path.');
    const pathParams = getPathParams(path);
    if (!pathParams.length)
        return vscode.window.showInformationMessage('Cancel: Can not find path params with pattern: ":param".');
    const insertLines = pathParams.map(p => {
        return `@PathParams("${p}") ${p}: number,`;
    });
    const edit = new vscode.WorkspaceEdit();
    const template = `        ${insertLines.join('\n\t\t')}
`;
    const lineCloseFunc = getLineCloseFunction(line, document);
    edit.insert(document.uri, new vscode.Position(lineCloseFunc.lineNumber, 0), template);
    vscode.workspace.applyEdit(edit);
}
exports.handleAddPathParams = handleAddPathParams;
function getLineCloseFunction(line, document) {
    const totalLine = document.lineCount;
    for (let index = line.lineNumber; index < totalLine; index++) {
        const line = document.lineAt(index);
        if (line.text.includes(') {') || line.text.includes('){'))
            return line;
    }
    return line;
}
function getPathParams(path) {
    const parts = path.split('/').filter(Boolean);
    const params = [];
    parts.map(p => {
        if (p.includes(':')) {
            params.push(p.replace(':', ""));
        }
    });
    return params;
}
function getPath(line) {
    const paths = util_1.getMatch(/".*"|'.*'/gm, line);
    if (!paths || !paths.length) {
        return '';
    }
    return paths[0].replace(/"/g, '').replace(/'/g, '');
}
//# sourceMappingURL=ControllerProvider.js.map