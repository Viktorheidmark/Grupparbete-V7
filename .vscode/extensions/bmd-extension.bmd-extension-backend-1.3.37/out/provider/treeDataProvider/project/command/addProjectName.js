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
const API_1 = require("../../../../API");
const Request_1 = require("../../../../Request");
const TreeProviderProject_1 = require("../../TreeProviderProject");
function addProjectName() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const folders = vscode.workspace.workspaceFolders;
        if (!((_a = folders) === null || _a === void 0 ? void 0 : _a.length))
            return;
        const projectName = folders[0].name;
        const data = yield Request_1.Request.post(API_1.API.Project.post, { name: projectName });
        console.log('data:', data);
        if (data) {
            vscode.window.showInformationMessage(`Create project success`);
            const bmdProject = new TreeProviderProject_1.TreeProviderProject(vscode.workspace.rootPath);
            bmdProject.refresh();
        }
    });
}
exports.addProjectName = addProjectName;
//# sourceMappingURL=addProjectName.js.map