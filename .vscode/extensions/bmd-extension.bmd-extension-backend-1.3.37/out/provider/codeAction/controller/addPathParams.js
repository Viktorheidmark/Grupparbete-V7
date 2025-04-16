"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constant_1 = require("../../../constant");
const util_1 = require("./util");
const util_2 = require("../../errorChecking/util");
function addPathParams(document, range) {
    const line = document.lineAt(range.start);
    if (isControllerFile(document) && isMethodDecorator(line.text)) {
        console.log('isControllerFile(document) && isMethodDecorator(line.text):', isControllerFile(document) && isMethodDecorator(line.text));
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
        return undefined;
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
    return __awaiter(this, void 0, void 0, function* () {
        const line = document.lineAt(range.start);
        const path = util_1.getPath(line.text);
        if (!path)
            return vscode.window.showInformationMessage('Cancel: Can not find path.');
        const pathParams = util_1.getPathParams(path);
        if (!pathParams.length)
            return vscode.window.showInformationMessage('Cancel: Can not find path params with pattern: ":param".');
        const paramLines = util_2.getParamLinesInFunction(line.lineNumber, document);
        const params = paramLines.map(l => util_2.getParams(l.text)).filter(Boolean);
        const notExistParams = pathParams.filter(p => !params.includes(p));
        if (!notExistParams.length)
            return vscode.window.showInformationMessage('Cancel: All params were existed.');
        const param = yield vscode.window.showQuickPick(notExistParams, { ignoreFocusOut: true });
        if (!param)
            return vscode.window.showInformationMessage('Cancel: Do not select path params.');
        const edit = new vscode.WorkspaceEdit();
        const template = `        @PathParams("${param}") ${param}: number,
`;
        const lineCloseFunc = util_1.getLineCloseFunction(line, document);
        edit.insert(document.uri, new vscode.Position(lineCloseFunc.lineNumber, 0), template);
        vscode.workspace.applyEdit(edit);
    });
}
exports.handleAddPathParams = handleAddPathParams;
//# sourceMappingURL=addPathParams.js.map