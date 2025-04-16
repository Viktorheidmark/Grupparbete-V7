"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constant_1 = require("../../constant");
const helper_1 = require("./helper");
const util_1 = require("../../util");
function createBuilderAction(document, range) {
    if (isQueryBuilder(document, range)) {
        const insertBuilderRelation = createInsertBuilderRelation(document, range);
        return [
            insertBuilderRelation,
        ];
    }
    return [];
}
exports.createBuilderAction = createBuilderAction;
function isQueryBuilder(document, range) {
    const start = range.start;
    const line = document.lineAt(start.line);
    return line.text.includes('createQueryBuilder');
}
function createInsertBuilderRelation(document, range) {
    const entity = new vscode.CodeAction(constant_1.EntityAction.AddBuilderRelation, vscode.CodeActionKind.QuickFix);
    entity.command = {
        command: constant_1.EntityAction.AddBuilderRelation,
        title: 'Add builder relation: ',
        tooltip: 'Add builder relation: ',
        arguments: [document, range]
    };
    return entity;
}
function insertBuilderRelation(typeFunc, document, range) {
    return __awaiter(this, void 0, void 0, function* () {
        const edit = new vscode.WorkspaceEdit();
        const entityObj = helper_1.getEntityFromFunction(document, range);
        const entity = entityObj.text;
        if (!entity)
            return vscode.window.showInformationMessage('Can not get entity');
        const relations = helper_1.getRelationsEntity(entity);
        if (!relations.length)
            return vscode.window.showInformationMessage('Not exist any relation');
        const relation = yield vscode.window.showQuickPick(relations, { ignoreFocusOut: true });
        if (!relation)
            return;
        let first = '';
        let second = '';
        if (!relation.includes('.')) {
            first = `${util_1.getFullTextType(entity).camelCase}.${relation}`;
            second = `${relation}`;
        }
        else {
            first = `${relation}`;
            const words = first.split('.');
            second = `${words[1]}`;
        }
        const fullText = util_1.getFullTextType(entity);
        let template = `.leftJoinAndSelect('{{first}}', '{{second}}')
    `;
        template = template.replace(/{{first}}/g, first);
        template = template.replace(/{{second}}/g, second);
        const start = range.start;
        const line = document.lineAt(start.line);
        console.log('line:', line);
        const lastRelation = helper_1.findLastLineRelation(document, line);
        console.log('lastRelation:', lastRelation);
        edit.insert(document.uri, new vscode.Position(lastRelation, 12), template);
        vscode.workspace.applyEdit(edit);
    });
}
exports.insertBuilderRelation = insertBuilderRelation;
//# sourceMappingURL=handleBuilder.js.map