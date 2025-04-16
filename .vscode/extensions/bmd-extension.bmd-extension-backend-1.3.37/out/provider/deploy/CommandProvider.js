"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
var BMDCommand;
(function (BMDCommand) {
    BMDCommand["Init"] = "bmdextension.init";
    BMDCommand["CreateControllerResource"] = "bmdextension.createControllerResource";
    BMDCommand["CreateController"] = "bmdextension.createController";
    BMDCommand["CreateService"] = "bmdextension.createService";
    BMDCommand["CreateEntity"] = "bmdextension.createEntity";
    BMDCommand["CreateEntityRequest"] = "bmdextension.createEntityRequest";
    BMDCommand["AddModuleContentDefine"] = "bmdextension.contentDefine";
    BMDCommand["AddModuleConfiguration"] = "bmdextension.configuration";
})(BMDCommand = exports.BMDCommand || (exports.BMDCommand = {}));
class DeployProvider {
    // vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));
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
                id: BMDCommand.Init,
                title: 'BMD: Init Project',
                params: []
            },
            {
                id: BMDCommand.AddModuleConfiguration,
                title: 'BMD: Add Module Configuration',
                params: []
            },
            {
                id: BMDCommand.AddModuleContentDefine,
                title: 'BMD: Add Module Content Define',
                params: []
            },
            {
                id: BMDCommand.CreateController,
                title: 'BMD: New Controller',
                params: []
            },
            {
                id: BMDCommand.CreateControllerResource,
                title: 'BMD: New Controller Resource',
                params: []
            },
            {
                id: BMDCommand.CreateEntity,
                title: 'BMD: New Entity',
                params: []
            },
            {
                id: BMDCommand.CreateEntityRequest,
                title: 'BMD: New Entity Request',
                params: []
            },
            {
                id: BMDCommand.CreateService,
                title: 'BMD: New Service',
                params: []
            },
        ];
        const toDep = (command) => {
            let cmd = undefined;
            return new Dependency(command.title, vscode.TreeItemCollapsibleState.None, cmd, command.id);
        };
        const commandTree = commands.map(c => toDep(c));
        return Promise.resolve(commandTree);
    }
}
exports.DeployProvider = DeployProvider;
class Dependency extends vscode.TreeItem {
    constructor(label, collapsibleState, command, context) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.context = context;
        this.iconPath = {
            light: path.join(__filename, '..', '..', 'media', 'light', 'infinite.svg'),
            dark: path.join(__filename, '..', '..', 'media', 'dark', 'infinite.svg')
        };
        this.contextValue = this.context;
    }
    get tooltip() {
        return `${this.label}`;
    }
}
exports.Dependency = Dependency;
//# sourceMappingURL=CommandProvider.js.map