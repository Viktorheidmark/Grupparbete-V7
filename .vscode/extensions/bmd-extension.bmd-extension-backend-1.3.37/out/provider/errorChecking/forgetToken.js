"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util_1 = require("./util");
const constant_1 = require("../../constant");
function getErrorForgetToken(document) {
    const lines = getAllUseAuthLine(document);
    if (!lines || !lines.length)
        return [];
    const errors = [];
    for (const l of lines) {
        const lineNumber = l.lineNumber;
        const paramLines = util_1.getParamLinesInFunction(lineNumber, document);
        const params = paramLines.map(l => util_1.getParams(l.text)).filter(Boolean);
        if (!params.some(p => p == 'token')) {
            let item = {
                code: constant_1.ControllerAction.AddPathParams,
                message: `"Params 'token' is required`,
                range: new vscode.Range(new vscode.Position(lineNumber, l.firstNonWhitespaceCharacterIndex), new vscode.Position(lineNumber, l.text.length - 1)),
                severity: vscode.DiagnosticSeverity.Error,
                source: 'typescript',
                relatedInformation: [
                    new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(lineNumber, l.firstNonWhitespaceCharacterIndex), new vscode.Position(lineNumber, l.text.length - 1))), `Param 'token' is required`)
                ]
            };
            errors.push(item);
        }
    }
    return errors;
}
exports.getErrorForgetToken = getErrorForgetToken;
function getAllUseAuthLine(document) {
    const lines = [];
    const totalLine = document.lineCount;
    for (let index = 0; index < totalLine; index++) {
        const line = document.lineAt(index);
        if (line.text.includes('UseAuth') && line.text.includes('VerificationJWT')) {
            lines.push(line);
        }
    }
    return lines;
}
//# sourceMappingURL=forgetToken.js.map