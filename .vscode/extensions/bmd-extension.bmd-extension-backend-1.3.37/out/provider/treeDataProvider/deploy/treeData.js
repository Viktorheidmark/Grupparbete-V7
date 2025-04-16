"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../constant");
const Dependency_1 = require("../Dependency");
const vscode = require("vscode");
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
exports.deployDependencies = deployCommand.map(c => {
    return new Dependency_1.Dependency(c.title, vscode.TreeItemCollapsibleState.None, undefined, c.id, c.icon ? c.icon : 'none');
});
//# sourceMappingURL=treeData.js.map