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
const FsProvider_1 = require("../../../../FsProvider");
const constant_1 = require("../../../../constant");
function addContentDefine() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!FsProvider_1.FSProvider.isValidStructure()) {
            return vscode.window.showInformationMessage("Cancel!. Wrong project's structure.");
        }
        const initFiles = () => {
            FsProvider_1.FSProvider.copyFile('contentDefine/AdminContentDefineController.ts.txt', 'src/controllers/admin/ContentDefineController.ts');
            FsProvider_1.FSProvider.copyFile('contentDefine/CustomerContentDefineController.ts.txt', 'src/controllers/customer/ContentDefineController.ts');
            FsProvider_1.FSProvider.copyFile('contentDefine/ContentDefine.ts.txt', 'src/entity/ContentDefine.ts');
            FsProvider_1.FSProvider.copyFile('contentDefine/ContentDefineService.ts.txt', 'src/services/ContentDefineService.ts');
            vscode.window.showInformationMessage("Add module CONTENT DEFINE successfully!");
        };
        if (FsProvider_1.FSProvider.checkExist('src/entity/ContentDefine.ts')) {
            const confirm = yield vscode.window.showQuickPick([constant_1.Confirmation.No, constant_1.Confirmation.Yes], {
                placeHolder: 'Module CONTENT DEFINE is already exist. You want to REPLACE?',
                ignoreFocusOut: true
            });
            if (!confirm || confirm == constant_1.Confirmation.No) {
                return vscode.window.showInformationMessage("Cancel: Add module CONTENT DEFINE.");
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
exports.addContentDefine = addContentDefine;
//# sourceMappingURL=contentDefine.js.map