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
const FsProvider_1 = require("../../../../FsProvider");
const vscode = require("vscode");
const util_1 = require("../../../../util");
const constant_1 = require("../../../../constant");
const vscode_1 = require("vscode");
function createEntity(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!FsProvider_1.FSProvider.isValidStructure()) {
            return vscode.window.showInformationMessage("Cancel!. Wrong project's structure.");
        }
        if (fsPath != undefined && !fsPath.includes('entity')) {
            return vscode.window.showInformationMessage("Please select 'entity' folder");
        }
        let entity = yield vscode.window.showInputBox({
            placeHolder: "Enter entity name: ",
            ignoreFocusOut: true
        });
        if (!entity) {
            return vscode.window.showInformationMessage("Cancel!. Do not input entity name.");
        }
        const entityTextTypes = util_1.getFullTextType(entity);
        const distPath = `src/entity/${entityTextTypes.classifyCase}.ts`;
        if (FsProvider_1.FSProvider.checkExist(distPath)) {
            const confirm = yield vscode.window.showQuickPick([constant_1.Confirmation.Yes, constant_1.Confirmation.No], {
                placeHolder: "This file already exist in this folder. Do you want to replace it.",
                ignoreFocusOut: true
            });
            if (!confirm || confirm == constant_1.Confirmation.No) {
                return vscode.window.showInformationMessage("Cancel: add ENTITY.");
            }
        }
        FsProvider_1.FSProvider.copyAndReplaceFile('entity/entity.txt', distPath, [
            { regex: /{{snake}}/g, value: entityTextTypes.snakeCase },
            { regex: /{{classify}}/g, value: entityTextTypes.classifyCase },
            { regex: /{{camel}}/g, value: entityTextTypes.camelCase }
        ]);
        let uri = vscode_1.Uri.file(FsProvider_1.FSProvider.getFullPath(distPath));
        yield vscode_1.commands.executeCommand('vscode.openFolder', uri);
        return vscode.window.showInformationMessage("Create ENTITY successfully!");
    });
}
exports.createEntity = createEntity;
//# sourceMappingURL=createEntity.js.map