"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const util_1 = require("../util");
function updateDiagnostics(document, collection) {
    if (isControllerFile(document)) {
        const errors = getErrorChecking(document);
        if (!errors || !errors.length)
            collection.clear();
        collection.set(document.uri, errors);
    }
    else {
        collection.clear();
    }
}
exports.updateDiagnostics = updateDiagnostics;
function getErrorChecking(document) {
    const lines = getAllJoiRequireLine(document);
    if (!lines || !lines.length)
        return [];
    const errors = [];
    errors.push(...getErrorValidateRequire(document));
    errors.push(...getErrorForgetToken(document));
    return errors;
}
function getErrorForgetToken(document) {
    const lines = getAllJoiRequireLine(document);
    if (!lines || !lines.length)
        return [];
    const errors = [];
    for (const l of lines) {
        const lineNumber = l.lineNumber;
        const property = getValidateProperty(l.text);
        if (!property)
            continue;
        const paramLines = getParamLinesInFunction(lineNumber, document);
        const params = paramLines.map(l => getParams(l.text)).filter(Boolean);
        if (!params.some(p => p == property)) {
            errors.push({
                code: 'required',
                message: `"${property}" not required`,
                range: new vscode.Range(new vscode.Position(lineNumber, l.firstNonWhitespaceCharacterIndex), new vscode.Position(lineNumber, l.text.length - 1)),
                severity: vscode.DiagnosticSeverity.Error,
                source: 'typescript',
                relatedInformation: [
                    new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(lineNumber, l.firstNonWhitespaceCharacterIndex), new vscode.Position(lineNumber, l.text.length - 1))), `Params: ${params.join(', ')}`)
                ]
            });
        }
    }
    return errors;
}
function getErrorValidateRequire(document) {
    const lines = getAllUseAuthLine(document);
    if (!lines || !lines.length)
        return [];
    const errors = [];
    for (const l of lines) {
        const lineNumber = l.lineNumber;
        const paramLines = getParamLinesInFunction(lineNumber, document);
        const params = paramLines.map(l => getParams(l.text)).filter(Boolean);
        if (!params.some(p => p == 'token')) {
            errors.push({
                code: 'required',
                message: `"Params 'token' is required`,
                range: new vscode.Range(new vscode.Position(lineNumber, l.firstNonWhitespaceCharacterIndex), new vscode.Position(lineNumber, l.text.length - 1)),
                severity: vscode.DiagnosticSeverity.Error,
                source: 'typescript',
                relatedInformation: [
                    new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(lineNumber, l.firstNonWhitespaceCharacterIndex), new vscode.Position(lineNumber, l.text.length - 1))), `Param 'token' is required`)
                ]
            });
        }
    }
    return errors;
}
function getValidateProperty(line) {
    const matches = util_1.getMatch(/\w*:/gm, line);
    if (!matches || !matches.length)
        return null;
    else
        return matches[0].replace(/:/g, '');
}
function getParams(line) {
    const matches = util_1.getMatch(/"\w*"|'\w*'/gm, line);
    if (!matches || !matches.length)
        return null;
    else
        return matches[0].replace(/"/g, '').replace(/'/g, '');
}
function getParamLinesInFunction(lineNumber, document) {
    const lines = [];
    const totalLine = document.lineCount;
    for (let index = lineNumber; index < totalLine; index++) {
        const line = document.lineAt(index);
        if (line.text.includes('@') &&
            !line.text.includes('UseAuth') &&
            !line.text.includes('Validator') &&
            !line.text.includes('Validator') &&
            !line.text.includes('Req') &&
            !line.text.includes('Res')) {
            lines.push(line);
        }
        if (line.text.includes(') {') || line.text.includes('){'))
            break;
    }
    return lines;
}
function getAllJoiRequireLine(document) {
    const lines = [];
    const totalLine = document.lineCount;
    for (let index = 0; index < totalLine; index++) {
        const line = document.lineAt(index);
        if (line.text.includes('Joi') && line.text.includes('require')) {
            lines.push(line);
        }
    }
    return lines;
}
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
function isControllerFile(document) {
    return document && path.basename(document.uri.fsPath).includes('Controller');
}
//# sourceMappingURL=errorChecking.js.map