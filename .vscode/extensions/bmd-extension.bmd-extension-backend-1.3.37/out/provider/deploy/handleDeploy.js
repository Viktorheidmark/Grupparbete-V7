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
const util_1 = require("../../util");
const SOURCE_FILE_DEPLOY = 'init/deploy.sh.txt';
let NEXT_TERM_ID = 1;
function handleDeploy(file, env) {
    return __awaiter(this, void 0, void 0, function* () {
        let link = '{{link}}';
        function initDeploy(from, to) {
            FsProvider_1.FSProvider.copyAndReplaceFile(from, to, [
                { regex: /{{env}}/g, value: env },
                { regex: /{{env_lower}}/g, value: util_1.getFullTextType(env).lowerCase },
                { regex: /{{link}}/g, value: link },
            ]);
        }
        const isExist = FsProvider_1.FSProvider.checkExist(file);
        if (!isExist) {
            const confirm = yield vscode.window.showQuickPick([constant_1.Confirmation.Yes, constant_1.Confirmation.No], {
                placeHolder: `Deploy ${env} file (${file}) doesn't not exist. You want to create it?`,
                ignoreFocusOut: true
            });
            if (!confirm || confirm == constant_1.Confirmation.No) {
                return vscode.window.showInformationMessage(`Cancel: deploy ${env}.`);
            }
            initDeploy('init/deploy.sh.txt', file);
        }
        if (isNotReplaceLink(file)) {
            link = yield vscode.window.showInputBox({
                placeHolder: "Not found repository's link. Enter link: ",
                ignoreFocusOut: true
            });
            if (!link) {
                return vscode.window.showInformationMessage("Cancel deploy!. Do not input repository's link..");
            }
            else {
                initDeploy('init/deploy.sh.txt', file);
            }
        }
        const terminal = vscode.window.createTerminal(`Deploy ${env}#${NEXT_TERM_ID++}`);
        terminal.show();
        terminal.sendText(`sh ${file}`, true);
    });
}
function deployStaging() {
    return __awaiter(this, void 0, void 0, function* () {
        const DEPLOY_FILE = 'deploy.staging.sh';
        yield handleDeploy(DEPLOY_FILE, "STAGING");
    });
}
exports.deployStaging = deployStaging;
function deployProduct() {
    return __awaiter(this, void 0, void 0, function* () {
        const DEPLOY_FILE = 'deploy.production.sh';
        yield handleDeploy(DEPLOY_FILE, "PRODUCTION");
    });
}
exports.deployProduct = deployProduct;
function isNotReplaceLink(file) {
    const fileContent = FsProvider_1.FSProvider.getContentInFile(file);
    return fileContent.includes('{{link}}');
}
function openDocs() {
}
exports.openDocs = openDocs;
function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <script>
        window.addEventListener('message', (e) => {
          switch (e.data.command) {
            case 'kbd-event': {
              if (true) {
                window.dispatchEvent(new KeyboardEvent('keydown', e.data.data));
              }
              break;
            }
          }
        }, false);
      </script>
    </head>
    <body style="margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: '#fff'">
        <iframe src="https://172tikatika.bmd.com.vn:4172/docs_customer"
            width="100%"
            height="100%"
            frameborder="0"
            style="border: 0; left: 0; right: 0; bottom: 0; top: 0; position:absolute;" />
    </body>
    </html>`;
}
//# sourceMappingURL=handleDeploy.js.map