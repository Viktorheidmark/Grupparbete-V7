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
const constant_1 = require("../../../../constant");
function addConfiguration() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!FsProvider_1.FSProvider.isValidStructure()) {
            return vscode.window.showInformationMessage("Cancel!. Wrong project's structure.");
        }
        const initFiles = () => {
            FsProvider_1.FSProvider.copyFile('configuration/AdminConfigurationController.ts.txt', 'src/controllers/admin/ConfigurationController.ts');
            FsProvider_1.FSProvider.copyFile('configuration/Configuration.ts.txt', 'src/entity/Configuration.ts');
            FsProvider_1.FSProvider.copyFile('configuration/ConfigurationService.ts.txt', 'src/services/ConfigurationService.ts');
            vscode.window.showInformationMessage("Add module CONFIGURATION successfully!");
        };
        if (FsProvider_1.FSProvider.checkExist('src/entity/ContentDefine.ts')) {
            const confirm = yield vscode.window.showQuickPick([constant_1.Confirmation.No, constant_1.Confirmation.Yes], {
                placeHolder: 'Module CONFIGURATION is already exist. You want to REPLACE?',
                ignoreFocusOut: true
            });
            if (!confirm || confirm == constant_1.Confirmation.No) {
                return vscode.window.showInformationMessage("Cancel: Add module CONFIGURATION.");
            }
            else {
                initFiles();
            }
        }
        else {
            initFiles();
        }
    });
}
exports.addConfiguration = addConfiguration;
//# sourceMappingURL=configuration.js.map