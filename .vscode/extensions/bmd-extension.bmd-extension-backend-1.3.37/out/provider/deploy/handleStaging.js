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
const FsProvider_1 = require("../../FsProvider");
const constant_1 = require("../../constant");
let NEXT_TERM_ID = 1;
const DEPLOY_FILE = 'deploy.staging.sh';
function deployStaging() {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = FsProvider_1.FSProvider.checkExist(DEPLOY_FILE);
        if (!isExist) {
            const confirm = yield vscode.window.showQuickPick([constant_1.Confirmation.Yes, constant_1.Confirmation.No], { placeHolder: `Deploy Staging file (${DEPLOY_FILE}) doesn't not exist. You want to create it?` });
            if (!confirm || confirm == constant_1.Confirmation.No) {
                return vscode.window.showInformationMessage("Cancel: deploy STAGING.");
            }
            FsProvider_1.FSProvider.copyFile('init/deploy.sh.txt', DEPLOY_FILE);
        }
        const terminal = vscode.window.createTerminal(`Deploy STAGING#${NEXT_TERM_ID++}`);
        terminal.show();
        terminal.sendText(`sh ${DEPLOY_FILE}`);
    });
}
exports.deployStaging = deployStaging;
//# sourceMappingURL=handleStaging.js.map