"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const treeData_1 = require("./entity/treeData");
const Dependency_1 = require("./Dependency");
const treeData_2 = require("./controller/treeData");
const treeData_3 = require("./service/treeData");
const treeData_4 = require("./module/treeData");
const treeData_5 = require("./deploy/treeData");
class TreeProviderCommand {
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
        function divide(part, icon = '') {
            const totalLetter = 32;
            const remainSeparator = totalLetter - part.length;
            const separator = `:`.repeat(parseInt((remainSeparator / 2) + ''));
            return new Dependency_1.Dependency(`${separator}${part.toUpperCase()}${separator}`, vscode.TreeItemCollapsibleState.None, undefined, undefined, icon ? icon : 'none');
        }
        return Promise.resolve([
            divide('entity'),
            ...treeData_1.entityDependencies,
            divide('service'),
            ...treeData_3.serviceDependencies,
            divide('controller'),
            ...treeData_2.controllerDependencies,
            divide('module'),
            ...treeData_4.moduleDependencies,
            divide('deploy'),
            ...treeData_5.deployDependencies,
        ]);
    }
}
exports.TreeProviderCommand = TreeProviderCommand;
//# sourceMappingURL=TreeProvider.js.map