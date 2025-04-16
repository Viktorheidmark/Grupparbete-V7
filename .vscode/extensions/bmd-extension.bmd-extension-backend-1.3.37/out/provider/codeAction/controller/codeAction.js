"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const addPathParams_1 = require("./addPathParams");
const addTokenParam_1 = require("./addTokenParam");
const addValidation_1 = require("./addValidation");
class ControllerActionProvider {
    provideCodeActions(document, range) {
        const actionAddPathParams = addPathParams_1.addPathParams(document, range);
        if (actionAddPathParams) {
            return [actionAddPathParams];
        }
        const actionAddTokenParam = addTokenParam_1.addTokenParam(document, range);
        if (actionAddTokenParam) {
            return [actionAddTokenParam];
        }
        const actionAddValidation = addValidation_1.addValidationRequired(document, range);
        if (actionAddValidation) {
            return [actionAddValidation];
        }
        return [];
    }
}
exports.ControllerActionProvider = ControllerActionProvider;
ControllerActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=codeAction.js.map