"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constant_1 = require("../../constant");
const treeData_1 = require("./entity/treeData");
const Dependency_1 = require("./Dependency");
const treeData_2 = require("./controller/treeData");
const treeData_3 = require("./service/treeData");
const treeData_4 = require("./module/treeData");
class TreeProvider {
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
        const deployCommand = [
            {
                id: constant_1.Deploy.DeployStaging,
                title: 'STAGING',
                icon: 'spaceship'
            },
            {
                id: constant_1.Deploy.DeployProduction,
                title: 'PRODUCTION',
                icon: 'spaceship-2'
            }
        ];
        const section5 = deployCommand.map(c => {
            return new Dependency_1.Dependency(c.title, vscode.TreeItemCollapsibleState.None, undefined, c.id, c.icon ? c.icon : 'none');
        });
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
            ...section5,
        ]);
    }
}
exports.TreeProvider = TreeProvider;
//# sourceMappingURL=index.js.map