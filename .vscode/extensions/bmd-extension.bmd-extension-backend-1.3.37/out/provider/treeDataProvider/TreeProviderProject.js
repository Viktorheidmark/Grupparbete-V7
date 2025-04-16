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
const Request_1 = require("../../Request");
const API_1 = require("../../API");
const Dependency_1 = require("./Dependency");
class TreeProviderProject {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            let projects = [];
            const data = yield Request_1.Request.get(API_1.API.Project.get);
            if (data) {
                projects = data.data.projects;
            }
            const projectDependencies = projects.map(p => {
                return new Dependency_1.Dependency(p.name, vscode.TreeItemCollapsibleState.None, {
                    command: 'bmdextension.getProjectDetails',
                    title: '',
                    arguments: [p.name]
                }, undefined, p.icon ? p.icon : 'none');
            });
            return Promise.resolve([
                ...projectDependencies,
            ]);
        });
    }
}
exports.TreeProviderProject = TreeProviderProject;
//# sourceMappingURL=TreeProviderProject.js.map