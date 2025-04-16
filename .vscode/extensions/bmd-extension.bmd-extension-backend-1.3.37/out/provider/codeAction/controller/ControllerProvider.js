"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const addPathParams_1 = require("./addPathParams");
const addTokenParam_1 = require("./addTokenParam");
class ControllerActionProvider {
    provideCodeActions(document, range) {
        const actionAddPathParams = addPathParams_1.addPathParams(document, range);
        const actionAddTokenParam = addTokenParam_1.addTokenParam(document, range);
        return [
            actionAddPathParams,
            actionAddTokenParam
        ];
    }
}
exports.ControllerActionProvider = ControllerActionProvider;
ControllerActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=ControllerProvider.js.map