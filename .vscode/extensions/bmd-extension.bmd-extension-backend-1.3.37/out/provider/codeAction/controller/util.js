"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../../util");
function getLineCloseFunction(line, document) {
    const totalLine = document.lineCount;
    for (let index = line.lineNumber; index < totalLine; index++) {
        const line = document.lineAt(index);
        if (line.text.includes(') {') || line.text.includes('){'))
            return line;
    }
    return line;
}
exports.getLineCloseFunction = getLineCloseFunction;
function getLineOpenFunction(line, document) {
    const totalLine = document.lineCount;
    for (let index = line.lineNumber; index < totalLine; index++) {
        const line = document.lineAt(index);
        if (line.text.includes('async') && line.text.includes('('))
            return line;
    }
    return line;
}
exports.getLineOpenFunction = getLineOpenFunction;
function getPathParams(path) {
    const parts = path.split('/').filter(Boolean);
    const params = [];
    parts.map(p => {
        if (p.includes(':')) {
            params.push(p.replace(':', ""));
        }
    });
    return params;
}
exports.getPathParams = getPathParams;
function getPath(line) {
    const paths = util_1.getMatch(/".*"|'.*'|`.*`/gm, line);
    if (!paths || !paths.length) {
        return '';
    }
    return paths[0].replace(/"/g, '').replace(/'/g, '').replace(/`/g, '');
}
exports.getPath = getPath;
//# sourceMappingURL=util.js.map