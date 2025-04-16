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
const FsProvider_1 = require("../FsProvider");
const vscode = require("vscode");
const util_1 = require("../util");
const constant_1 = require("../constant");
const vscode_1 = require("vscode");
function createService(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!FsProvider_1.FSProvider.isValidStructure()) {
            return vscode.window.showInformationMessage("Cancel!. Wrong project's structure.");
        }
        if (fsPath != undefined && !fsPath.includes('services')) {
            return vscode.window.showInformationMessage("Please select 'services' folder");
        }
        const entities = FsProvider_1.FSProvider.getAllFileInFolder('/src/entity');
        const entitySelected = yield vscode.window.showQuickPick([...entities, constant_1.OTHER]);
        let service = '';
        if (entitySelected && entitySelected != constant_1.OTHER) {
            service = entitySelected;
        }
        else {
            let input = yield vscode.window.showInputBox({
                placeHolder: "Enter service name: ",
                ignoreFocusOut: true
            });
            if (!input)
                return vscode.window.showInformationMessage("Cancel!. Do not input service name.");
            service = input.replace('service', '').replace('Service', '');
        }
        if (!service) {
            return vscode.window.showInformationMessage("Cancel!. Do not input service name.");
        }
        const serviceTextTypes = util_1.getFullTextType(service);
        const distPath = `src/services/${serviceTextTypes.classifyCase}Service.ts`;
        if (FsProvider_1.FSProvider.checkExist(distPath)) {
            const confirm = yield vscode.window.showQuickPick([constant_1.Confirmation.Yes, constant_1.Confirmation.No], { placeHolder: "This file already exist in this folder. Do you want to replace it?" });
            if (!confirm || confirm == constant_1.Confirmation.No) {
                return vscode.window.showInformationMessage("Cancel create service!.");
            }
        }
        FsProvider_1.FSProvider.copyAndReplaceFile('service/service.txt', distPath, [
            { regex: /{{snake}}/g, value: serviceTextTypes.snakeCase },
            { regex: /{{classify}}/g, value: serviceTextTypes.classifyCase },
            { regex: /{{camel}}/g, value: serviceTextTypes.camelCase }
        ]);
        let uri = vscode_1.Uri.file(FsProvider_1.FSProvider.getFullPath(distPath));
        yield vscode_1.commands.executeCommand('vscode.openFolder', uri);
        return vscode.window.showInformationMessage("Create SERVICE successfully!");
    });
}
exports.createService = createService;
//# sourceMappingURL=createService.js.map