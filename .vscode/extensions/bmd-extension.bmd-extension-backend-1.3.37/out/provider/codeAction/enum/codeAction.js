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
const API_1 = require("../../../API");
const constant_1 = require("../../../constant");
const Request_1 = require("../../../Request");
class EnumActionProvider {
    provideCodeActions(document, range) {
        if (isEnumLine(document, range)) {
            const action = new vscode.CodeAction(constant_1.BMDCommand.AddEnum, vscode.CodeActionKind.QuickFix);
            action.command = {
                command: constant_1.BMDCommand.AddEnum,
                title: 'Add enum',
                tooltip: 'Add enum',
                arguments: [document, range]
            };
            return [action];
        }
        return [];
    }
}
exports.EnumActionProvider = EnumActionProvider;
EnumActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
function isEnumLine(document, range) {
    const start = range.start;
    const line = document.lineAt(start.line);
    return line.text.includes('enum');
}
function addEnum(document, range) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const start = range.start;
        const line = document.lineAt(start.line);
        const enumName = getEnumNameInLine(line.text);
        const enumBody = getEnumBody(document, range);
        const folders = vscode.workspace.workspaceFolders;
        if (!((_a = folders) === null || _a === void 0 ? void 0 : _a.length))
            return;
        const projectName = folders[0].name;
        const data = yield Request_1.Request.post(API_1.API.Enum.post, {
            name: enumName,
            project: projectName,
            body: enumBody
        });
        if (data) {
            vscode.window.showInformationMessage(`Upload successfully!`);
        }
    });
}
exports.addEnum = addEnum;
function getEnumNameInLine(line) {
    const words = line.split(' ');
    for (let index = 0; index < words.length; index++) {
        const word = words[index];
        if (word == 'enum') {
            return words[index + 1];
        }
    }
    return ``;
}
function getEnumBody(document, range) {
    let start = range.start.line;
    const lines = [];
    const line = document.lineAt(start);
    lines.push(line.text); // Add select line
    let isLineOpenEnum = !line.text.includes('}');
    while (isLineOpenEnum) {
        start += 1;
        const nextLine = document.lineAt(start);
        lines.push(nextLine.text);
        isLineOpenEnum = !nextLine.text.includes('}');
    }
    const body = `
${lines.join('\n')}
    `;
    return body;
}
//# sourceMappingURL=codeAction.js.map