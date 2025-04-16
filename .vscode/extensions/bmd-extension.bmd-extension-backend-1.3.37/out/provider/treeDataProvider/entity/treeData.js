"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constant_1 = require("../../../constant");
const Dependency_1 = require("../Dependency");
const entityCommands = [{
        id: constant_1.BMDCommand.CreateEntity,
        title: 'ENTITY',
        icon: 'add'
    }, {
        id: constant_1.BMDCommand.CreateEntityRequest,
        title: 'ENTITY REQUEST',
        icon: 'add'
    }, {
        id: constant_1.EntityAction.AddProperty,
        title: 'PROPERTIES',
        icon: 'plus'
    }, {
        id: constant_1.EntityAction.OneToMany,
        title: 'ONE TO MANY',
        icon: 'social'
    }, {
        id: constant_1.EntityAction.ManyToOne,
        title: 'MANY TO ONE',
        icon: 'social'
    }, {
        id: constant_1.EntityAction.ManyToMany,
        title: 'MANY TO MANY',
        icon: 'social'
    }, {
        id: constant_1.EntityAction.OneToOne,
        title: 'ONE TO ONE',
        icon: 'social'
    }, {
        id: constant_1.EntityAction.ExportInterface,
        title: 'EXPORT INTERFACE',
        icon: 'import'
    }];
exports.entityDependencies = entityCommands.map(c => {
    return new Dependency_1.Dependency(c.title, vscode.TreeItemCollapsibleState.None, undefined, c.id, c.icon ? c.icon : 'none');
});
//# sourceMappingURL=treeData.js.map