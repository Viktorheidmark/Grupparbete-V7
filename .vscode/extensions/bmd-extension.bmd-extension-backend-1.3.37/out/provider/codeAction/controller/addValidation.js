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
function addValidationRequired(document, range) {
    const line = document.lineAt(range.start);
    if (isControllerFile(document) && isParamsDecorator(line.text)) {
        const action = new vscode.CodeAction(constant_1.ControllerAction.AddValidation, vscode.CodeActionKind.QuickFix);
        action.command = {
            command: constant_1.ControllerAction.AddValidation,
            title: 'Validation',
            arguments: [document, range]
        };
        return action;
    }
    else {
        return undefined;
    }
}
exports.addValidationRequired = addValidationRequired;
function isParamsDecorator(line) {
    return line.includes('@') && line.includes('Params');
}
function isControllerFile(document) {
    return document.fileName.includes('Controller');
}
function handleAddValidation(document, range) {
    return __awaiter(this, void 0, void 0, function* () {
        const line = document.lineAt(range.start);
        console.log('line:', line);
        const param = util_2.getParams(line.text);
        return;
        const edit = new vscode.WorkspaceEdit();
        const template = `        @PathParams("${param}") ${param}: number,
`;
        const lineCloseFunc = util_1.getLineCloseFunction(line, document);
        edit.insert(document.uri, new vscode.Position(lineCloseFunc.lineNumber, 0), template);
        vscode.workspace.applyEdit(edit);
    });
}
exports.handleAddValidation = handleAddValidation;
//# sourceMappingURL=addValidation.js.map