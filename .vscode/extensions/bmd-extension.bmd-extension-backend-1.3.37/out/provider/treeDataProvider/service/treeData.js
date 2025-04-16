"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../constant");
const Dependency_1 = require("../Dependency");
const vscode = require("vscode");
const serviceCommands = [{
        id: constant_1.BMDCommand.CreateService,
        title: 'SERVICE',
        icon: 'add'
    }, {
        id: constant_1.ConstructorFunction.PrivateService,
        title: 'INJECT CONSTRUCTOR',
        icon: 'vaccine'
    },];
exports.serviceDependencies = serviceCommands.map(c => {
    return new Dependency_1.Dependency(c.title, vscode.TreeItemCollapsibleState.None, undefined, c.id, c.icon ? c.icon : 'none');
});
//# sourceMappingURL=treeData.js.map