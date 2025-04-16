"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
function getParamLinesInFunction(lineNumber, document) {
    const lines = [];
    const totalLine = document.lineCount;
    for (let index = lineNumber; index < totalLine; index++) {
        const line = document.lineAt(index);
        const text = line.text.trim();
        if (text.includes('@') &&
            !text.includes('UseAuth') &&
            !text.includes('Validator') &&
            !text.includes('Validator') &&
            !text.includes('@Req') &&
            !text.includes('@Res') &&
            !text.includes('@Get') &&
            !text.includes('@Post') &&
            !text.includes('@Delete') &&
            !text.includes('@Put') &&
            !text.includes('@Patch') &&
            !text.startsWith('//')) {
            lines.push(line);
        }
        if (text.includes(') {') || text.includes('){'))
            break;
    }
    return lines;
}
exports.getParamLinesInFunction = getParamLinesInFunction;
function getParams(line) {
    const matches = util_1.getMatch(/"\w*"|'\w*'/gm, line);
    if (!matches || !matches.length)
        return null;
    else
        return matches[0].replace(/"/g, '').replace(/'/g, '');
}
exports.getParams = getParams;
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
exports.getAllJoiRequireLine = getAllJoiRequireLine;
//# sourceMappingURL=util.js.map