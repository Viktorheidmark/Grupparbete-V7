"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const constant_1 = require("../../constant");
class DeployProvider {
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
        const commands = [
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
        const toDep = (command) => {
            let cmd = undefined;
            return new Dependency(command.title, vscode.TreeItemCollapsibleState.None, cmd, command.id, command.icon);
        };
        const commandTree = commands.map(c => toDep(c));
        return Promise.resolve(commandTree);
    }
}
exports.DeployProvider = DeployProvider;
class Dependency extends vscode.TreeItem {
    constructor(label, collapsibleState, command, context, icon) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.context = context;
        this.icon = icon;
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', 'media', 'light', `${this.icon}.svg`),
            dark: path.join(__filename, '..', '..', '..', '..', 'media', 'dark', `${this.icon}.svg`)
        };
        this.contextValue = this.context;
    }
    get tooltip() {
        return `${this.label}`;
    }
}
exports.Dependency = Dependency;
//# sourceMappingURL=DeployProvider.js.map