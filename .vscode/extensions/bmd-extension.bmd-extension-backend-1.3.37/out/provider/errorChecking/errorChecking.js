"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const checkRequired_1 = require("./checkRequired");
const checkHeaderToken_1 = require("./checkHeaderToken");
const checkPathParam_1 = require("./checkPathParam");
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
    const errors = [];
    errors.push(...checkRequired_1.getErrorValidateRequire(document));
    errors.push(...checkHeaderToken_1.getErrorForgetToken(document));
    errors.push(...checkPathParam_1.getErrorPathParams(document));
    return errors;
}
function isControllerFile(document) {
    return document && path.basename(document.uri.fsPath).includes('Controller');
}
//# sourceMappingURL=errorChecking.js.map