"use strict";
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
//# sourceMappingURL=errorForgetToken.js.map