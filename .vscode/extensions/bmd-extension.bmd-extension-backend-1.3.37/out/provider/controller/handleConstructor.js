"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util_1 = require("../../util");
const FsProvider_1 = require("../../FsProvider");
function insertPrivateService(typeFunc, document) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!document || !document.uri) {
            document = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
        }
        if (!document) {
            vscode.window.showInformationMessage("Cancel: Can not find open document to insert");
            return;
        }
        const edit = new vscode.WorkspaceEdit();
        const services = FsProvider_1.FSProvider.getAllFileInFolder('/src/services');
        const service = yield vscode.window.showQuickPick([...services], { ignoreFocusOut: true });
        if (!service)
            return vscode.window.showInformationMessage('Please select service to complete action');
        const fullTextService = util_1.getFullTextType(service);
        const content = `\n\t\tprivate ${fullTextService.camelCase}: ${service},`;
        yield insertConstructIfNotExist(document);
        for (let index = 0; index < document.lineCount; index++) {
            const line = document.lineAt(index).text;
            if (line.includes('constructor')) {
                const matched1 = 'constructor()';
                const matched2 = 'constructor(';
                if (line.indexOf(matched1) != -1) {
                    const indexOf = line.indexOf(matched1) + matched1.length;
                    edit.insert(document.uri, new vscode.Position(index, indexOf - 1), content + `\n`);
                }
                else {
                    const indexOf = line.indexOf(matched2) + matched2.length;
                    edit.insert(document.uri, new vscode.Position(index, indexOf), content);
                }
            }
        }
        vscode.workspace.applyEdit(edit);
    });
}
exports.insertPrivateService = insertPrivateService;
function insertConstructIfNotExist(document) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isExistConstructor(document))
            return;
        const content = `    constructor(
    ) { }\n`;
        const index = getIndexOfLineIncludeClass(document);
        const edit = new vscode.WorkspaceEdit();
        edit.insert(document.uri, new vscode.Position(index + 1, 0), content);
        yield vscode.workspace.applyEdit(edit);
    });
}
function getIndexOfLineIncludeClass(document) {
    const lines = document.lineCount;
    let indexLine = 0;
    for (let index = 0; index < lines; index++) {
        const line = document.lineAt(index);
        if (line.text.includes('class')) {
            indexLine = index;
            break;
        }
    }
    return indexLine;
}
function isExistConstructor(document) {
    const lines = document.lineCount;
    let isExist = false;
    for (let index = 0; index < lines; index++) {
        const line = document.lineAt(index);
        if (line.text.includes('constructor')) {
            isExist = true;
        }
    }
    return isExist;
}
// export function insertConstructorAction(
//     document: vscode.TextDocument | undefined,
//     range: any,
// ) {
//     if (!document || !document.uri) {
//         document = vscode.window.activeTextEditor?.document
//     }
//     if (!document) {
//         vscode.window.showInformationMessage("Cancel: Can not find open document to insert")
//         return
//     }
//     if (isConstructorFunction(document, range)) {
//         const insertPrivateService = createConstructorFunc(document, range, ConstructorFunction.PrivateService);
//         return [
//             insertPrivateService
//         ]
//     } else {
//         return []
//     }
// }
// function isConstructorFunction(document: vscode.TextDocument, range: vscode.Range) {
//     const start = range.start;
//     const line = document.lineAt(start.line);
//     return line.text.includes('constructor')
// }
// function createConstructorFunc(document: vscode.TextDocument, range: vscode.Range, typeFunc: ConstructorFunction): vscode.CodeAction {
//     const controller = new vscode.CodeAction(typeFunc, vscode.CodeActionKind.QuickFix);
//     switch (typeFunc) {
//         case ConstructorFunction.PrivateService:
//             controller.command = {
//                 command: typeFunc,
//                 title: 'Insert private service.',
//                 tooltip: 'Insert private service.',
//                 arguments: [document]
//             };
//             break
//         default:
//             break;
//     }
//     return controller;
// }
//# sourceMappingURL=handleConstructor.js.map