"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constant_1 = require("../../../constant");
function createRelationAction(document, range) {
    if (isEntityRelations(document, range)) {
        const insertOneToMany = createAddRelationAction(document, range, constant_1.EntityAction.OneToMany);
        const insertManyToOne = createAddRelationAction(document, range, constant_1.EntityAction.ManyToOne);
        const insertManyToMany = createAddRelationAction(document, range, constant_1.EntityAction.ManyToMany);
        const insertOneToOne = createAddRelationAction(document, range, constant_1.EntityAction.OneToOne);
        return [
            insertOneToMany,
            insertManyToOne,
            insertManyToMany,
            insertOneToOne
        ];
    }
    return [];
}
exports.createRelationAction = createRelationAction;
function isEntityRelations(document, range) {
    const start = range.start;
    const line = document.lineAt(start.line);
    return line.text.includes('RELATIONS');
}
function createAddRelationAction(document, range, typeFunc) {
    const entity = new vscode.CodeAction(typeFunc, vscode.CodeActionKind.QuickFix);
    switch (typeFunc) {
        case constant_1.EntityAction.OneToMany:
            entity.command = {
                command: typeFunc,
                title: 'OneToMany with:',
                tooltip: 'OneToMany with:',
                arguments: [document]
            };
            break;
        case constant_1.EntityAction.ManyToOne:
            entity.command = {
                command: typeFunc,
                title: 'ManyToOne with:',
                tooltip: 'ManyToOne with:',
                arguments: [document]
            };
            break;
        case constant_1.EntityAction.ManyToMany:
            entity.command = {
                command: typeFunc,
                title: 'ManyToMany with:',
                tooltip: 'ManyToMany with:',
                arguments: [document]
            };
            break;
        case constant_1.EntityAction.OneToOne:
            entity.command = {
                command: typeFunc,
                title: 'OneToOne with:',
                tooltip: 'OneToOne with:',
                arguments: [document]
            };
            break;
    }
    return entity;
}
//# sourceMappingURL=handleRelation.js.map