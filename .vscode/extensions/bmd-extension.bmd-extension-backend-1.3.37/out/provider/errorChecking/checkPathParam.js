"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util_1 = require("./util");
const constant_1 = require("../../constant");
const util_2 = require("../codeAction/controller/util");
function getErrorPathParams(document) {
    const lines = getAllPathLine(document);
    if (!lines || !lines.length)
        return [];
    const errors = [];
    for (const l of lines) {
        const lineNumber = l.lineNumber;
        const path = util_2.getPath(l.text);
        const pathParams = util_2.getPathParams(path);
        const paramLines = util_1.getParamLinesInFunction(lineNumber, document);
        const params = paramLines.map(l => util_1.getParams(l.text)).filter(Boolean);
        let paramMission = pathParams.filter(p => !params.includes(p));
        if (paramMission && paramMission.length) {
            let item = {
                code: constant_1.ControllerAction.AddPathParams,
                message: `"Missing path params: ${paramMission.join(', ')}`,
                range: new vscode.Range(new vscode.Position(lineNumber, l.firstNonWhitespaceCharacterIndex), new vscode.Position(lineNumber, l.text.length - 1)),
                severity: vscode.DiagnosticSeverity.Error,
                source: 'typescript'
            };
            errors.push(item);
        }
    }
    return errors;
}
exports.getErrorPathParams = getErrorPathParams;
function getAllPathLine(document) {
    const lines = [];
    const totalLine = document.lineCount;
    for (let index = 0; index < totalLine; index++) {
        const line = document.lineAt(index);
        if (isPathLine(line.text)) {
            lines.push(line);
        }
    }
    return lines;
}
function isPathLine(line) {
    return (line.includes('@Get') ||
        line.includes('@Post') ||
        line.includes('@Delete') ||
        line.includes('@Put') ||
        line.includes('@Patch')) &&
        line.includes('/:');
}
//# sourceMappingURL=checkPathParam.js.map