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
function createController(fsPath, assetPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!FsProvider_1.FSProvider.isValidStructure()) {
            return vscode.window.showInformationMessage("Cancel!. Wrong project's structure.");
        }
        if (fsPath == undefined) {
            fsPath = 'src/controllers/';
        }
        if (!fsPath.includes('controllers/')) {
            return vscode.window.showErrorMessage("Please select subfolder in 'controllers'");
        }
        let lastFolder = '';
        if (fsPath.endsWith('controllers/')) {
            const folders = FsProvider_1.FSProvider.getAllFolderInFolder('src/controllers/');
            const subfolder = yield vscode.window.showQuickPick([...folders], { placeHolder: "Please select subfolder!", ignoreFocusOut: true });
            if (!subfolder)
                return vscode.window.showErrorMessage("Please select subfolder in 'controllers'");
            lastFolder = subfolder;
        }
        else {
            lastFolder = util_1.getLastFolderFromPath(fsPath);
        }
        const entities = FsProvider_1.FSProvider.getAllFileInFolder('/src/entity');
        const entitySelected = yield vscode.window.showQuickPick([...entities, constant_1.OTHER], { ignoreFocusOut: true });
        let controller = '';
        if (entitySelected && entitySelected != constant_1.OTHER) {
            controller = entitySelected;
        }
        else {
            let input = yield vscode.window.showInputBox({
                placeHolder: "Enter controller name: ",
                ignoreFocusOut: true
            });
            if (!input)
                return vscode.window.showInformationMessage("Cancel!. Do not input service name.");
            controller = input.replace('service', '').replace('Service', '');
        }
        controller = controller.replace('controller', '').replace('Controller', '');
        const controllerTextTypes = util_1.getFullTextType(controller);
        const lastFolderTextTypes = util_1.getFullTextType(lastFolder);
        const distPath = `src/controllers/${lastFolder}/${controllerTextTypes.classifyCase}Controller.ts`;
        if (FsProvider_1.FSProvider.checkExist(distPath)) {
            const confirm = yield vscode.window.showQuickPick([constant_1.Confirmation.Yes, constant_1.Confirmation.No], {
                placeHolder: "This file already exist in this folder. Do you want to replace it.",
                ignoreFocusOut: true
            });
            if (!confirm || confirm == constant_1.Confirmation.No) {
                return vscode.window.showInformationMessage("Cancel: add CONTROLLER.");
            }
        }
        const controllerPath = `/${lastFolderTextTypes.snakeCase}/${controllerTextTypes.camelCase}`;
        FsProvider_1.FSProvider.copyAndReplaceFile(assetPath, distPath, [
            { regex: /{{snake}}/g, value: controllerTextTypes.snakeCase },
            { regex: /{{classify}}/g, value: controllerTextTypes.classifyCase },
            { regex: /{{controller}}/g, value: controllerPath },
            { regex: /{{docs}}/g, value: lastFolderTextTypes.snakeCase },
            { regex: /{{camel}}/g, value: controllerTextTypes.camelCase },
            { regex: /ys/g, value: 'ies' },
        ]);
        let uri = vscode_1.Uri.file(FsProvider_1.FSProvider.getFullPath(distPath));
        yield vscode_1.commands.executeCommand('vscode.openFolder', uri);
    });
}
function createControllerNormal(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield createController(fsPath, 'controller/controller.txt');
        return vscode.window.showInformationMessage("Create CONTROLLER successfully!");
    });
}
exports.createControllerNormal = createControllerNormal;
function createControllerResource(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield createController(fsPath, 'controller/controllerResource.txt');
        return vscode.window.showInformationMessage("Create CONTROLLER RESOURCE successfully!");
    });
}
exports.createControllerResource = createControllerResource;
//# sourceMappingURL=createController.js.map