"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constant_1 = require("../../../constant");
const Dependency_1 = require("../Dependency");
const controllerCommands = [
    {
        id: constant_1.BMDCommand.CreateController,
        title: 'CONTROLLER',
        icon: 'add'
    }, {
        id: constant_1.BMDCommand.CreateControllerResource,
        title: 'CONTROLLER RESOURCE',
        icon: 'add'
    },
    {
        id: constant_1.ControllerAction.Get,
        title: 'GET',
        icon: 'get'
    },
    {
        id: constant_1.ControllerAction.Post,
        title: 'POST',
        icon: 'post'
    },
    {
        id: constant_1.ControllerAction.GetListAll,
        title: 'GET (ALL)',
        icon: 'list'
    },
    {
        id: constant_1.ControllerAction.GetListPagination,
        title: 'GET (PAGINATION)',
        icon: 'list'
    },
    {
        id: constant_1.ControllerAction.CreateItem,
        title: 'CREATE (ENTITY)',
        icon: 'create'
    },
    {
        id: constant_1.ControllerAction.CreateItemEntityRequest,
        title: 'CREATE (ENTITY REQUEST)',
        icon: 'create'
    },
    {
        id: constant_1.ControllerAction.UpdateItem,
        title: 'UPDATE',
        icon: 'update'
    },
    {
        id: constant_1.ControllerAction.DeleteItemByBlock,
        title: 'DELETE (BLOCK)',
        icon: 'quit'
    },
    {
        id: constant_1.ControllerAction.DeleteItemByRemove,
        title: 'DELETE (REMOVE)',
        icon: 'quit'
    },
    {
        id: constant_1.ControllerAction.Upload,
        title: 'UPLOAD (NORMAL)',
        icon: 'upload'
    },
    {
        id: constant_1.ControllerAction.UploadResize,
        title: 'UPLOAD (RESIZE)',
        icon: 'upload'
    },
];
exports.controllerDependencies = controllerCommands.map(c => {
    return new Dependency_1.Dependency(c.title, vscode.TreeItemCollapsibleState.None, undefined, c.id, c.icon ? c.icon : 'none');
});
//# sourceMappingURL=treeData.js.map