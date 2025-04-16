"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../constant");
const Dependency_1 = require("../Dependency");
const vscode = require("vscode");
const moduleCommand = [{
        id: constant_1.BMDCommand.Init,
        title: 'INIT PROJECT',
        icon: 'earth'
    }, {
        id: constant_1.BMDCommand.AddModuleConfiguration,
        title: 'CONFIGURATION',
        icon: 'plus'
    }, {
        id: constant_1.BMDCommand.AddModuleContentDefine,
        title: 'CONTENT DEFINE ',
        icon: 'plus'
    }];
exports.moduleDependencies = moduleCommand.map(c => {
    return new Dependency_1.Dependency(c.title, vscode.TreeItemCollapsibleState.None, undefined, c.id, c.icon ? c.icon : 'none');
});
//# sourceMappingURL=treeData.js.map