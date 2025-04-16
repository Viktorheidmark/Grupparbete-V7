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
const constant_1 = require("../../../../constant");
const FsProvider_1 = require("../../../../FsProvider");
const util_1 = require("../../../../util");
function insertEntityAction(typeFunc, document) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const edit = new vscode.WorkspaceEdit();
        let entity = 'Entity';
        let template = '';
        if (!document || !document.uri) {
            document = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
        }
        if (!document) {
            vscode.window.showInformationMessage("Cancel: Can not find open document to insert");
            return;
        }
        for (let index = 0; index < document.lineCount; index++) {
            const line = document.lineAt(index);
            if (line.text.includes('CoreEntity') && line.text.includes('class')) {
                let words = line.text.split(' ');
                for (let index = 0; index < words.length; index++) {
                    const word = words[index];
                    if (word == 'class') {
                        entity = words[index + 1];
                    }
                }
            }
            if (line.text.includes('METHODS')) {
                let lineInsertIndex = index - 2;
                switch (typeFunc) {
                    case constant_1.EntityAction.OneToMany:
                        template = yield generateRelations(entity, constant_1.EntityAction.OneToMany);
                        if (!template)
                            return;
                        edit.insert(document.uri, new vscode.Position(lineInsertIndex, 0), template);
                        break;
                    case constant_1.EntityAction.ManyToOne:
                        template = yield generateRelations(entity, constant_1.EntityAction.ManyToOne);
                        if (!template)
                            return;
                        edit.insert(document.uri, new vscode.Position(lineInsertIndex, 0), template);
                        break;
                    case constant_1.EntityAction.ManyToMany:
                        template = yield generateRelations(entity, constant_1.EntityAction.ManyToMany);
                        if (!template)
                            return;
                        edit.insert(document.uri, new vscode.Position(lineInsertIndex, 0), template);
                        break;
                    case constant_1.EntityAction.OneToOne:
                        template = yield generateRelations(entity, constant_1.EntityAction.OneToOne);
                        if (!template)
                            return;
                        edit.insert(document.uri, new vscode.Position(lineInsertIndex, 0), template);
                        break;
                    default:
                        break;
                }
            }
        }
        vscode.workspace.applyEdit(edit);
    });
}
exports.insertEntityAction = insertEntityAction;
function generateRelations(name1, relation) {
    return __awaiter(this, void 0, void 0, function* () {
        const entities = FsProvider_1.FSProvider.getAllFileInFolder('/src/entity');
        let name2 = yield vscode.window.showQuickPick(entities, {
            placeHolder: 'Select entity',
            ignoreFocusOut: true
        });
        if (!name2)
            return '';
        let injectString1 = '';
        switch (relation) {
            case constant_1.EntityAction.OneToMany:
                injectString1 = `
    @OneToMany(type => {{cap2}}, {{camel2}}s => {{camel2}}s.{{camel1}})
    {{camel2}}s: {{cap2}}[];
            `;
                break;
            case constant_1.EntityAction.ManyToOne:
                injectString1 = `
    @ManyToOne(type => {{cap2}}, {{camel2}} => {{camel2}}.{{camel1}}s)
    {{camel2}}: {{cap2}};
            `;
                break;
            case constant_1.EntityAction.ManyToMany:
                injectString1 = `
    @ManyToMany(type => {{cap2}}, {{camel2}}s => {{camel2}}s.{{camel1}}s)
    {{camel2}}s: {{cap2}}[];
            `;
                break;
            case constant_1.EntityAction.OneToOne:
                injectString1 = `
    @OneToOne(type => {{cap2}}, {{camel2}} => {{camel2}}.{{camel1}})
    {{camel2}}: {{cap2}};
            `;
                break;
        }
        const nameTextTypes1 = util_1.getFullTextType(name1);
        const nameTextTypes2 = util_1.getFullTextType(name2);
        injectString1 = injectString1.replace(/{{camel1}}/g, nameTextTypes1.camelCase);
        injectString1 = injectString1.replace(/{{camel2}}/g, nameTextTypes2.camelCase);
        injectString1 = injectString1.replace(/{{cap1}}/g, nameTextTypes1.classifyCase);
        injectString1 = injectString1.replace(/{{cap2}}/g, nameTextTypes2.classifyCase);
        if (injectString1.includes('ys')) {
            injectString1 = injectString1.replace(/ys/g, 'ies');
        }
        if (injectString1.includes('sss')) {
            injectString1 = injectString1.replace(/sss/g, 'sses');
        }
        return injectString1;
    });
}
//# sourceMappingURL=addRelation.js.map