"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util_1 = require("../../util");
const util_2 = require("./util");
function getErrorValidateRequire(document) {
    const lines = util_2.getAllJoiRequireLine(document);
    if (!lines || !lines.length)
        return [];
    const errors = [];
    for (const l of lines) {
        const lineNumber = l.lineNumber;
        const property = getValidateProperty(l.text.trim());
        if (!property)
            continue;
        const paramLines = util_2.getParamLinesInFunction(lineNumber, document);
        const params = paramLines.map(l => util_2.getParams(l.text)).filter(Boolean);
        if (!params.some(p => p == property)) {
            let item = {
                code: 'required',
                message: `"${property}" not required`,
                range: new vscode.Range(new vscode.Position(lineNumber, l.firstNonWhitespaceCharacterIndex), new vscode.Position(lineNumber, l.text.length - 1)),
                severity: vscode.DiagnosticSeverity.Error,
                source: 'typescript',
                relatedInformation: [
                    new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(lineNumber, l.firstNonWhitespaceCharacterIndex), new vscode.Position(lineNumber, l.text.length - 1))), `Params: ${params.join(', ')}`)
                ]
            };
            errors.push(item);
        }
    }
    return errors;
}
exports.getErrorValidateRequire = getErrorValidateRequire;
function getValidateProperty(line) {
    if (line.startsWith('//'))
        return null;
    const matches = util_1.getMatch(/\w*:/gm, line);
    if (!matches || !matches.length)
        return null;
    else
        return matches[0].replace(/:/g, '');
}
//# sourceMappingURL=checkRequired.js.map