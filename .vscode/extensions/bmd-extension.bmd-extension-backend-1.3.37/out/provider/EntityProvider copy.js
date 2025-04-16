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
const FsProvider_1 = require("./../FsProvider");
const vscode = require("vscode");
const util_1 = require("../util");
var EntityAction;
(function (EntityAction) {
    EntityAction["AddProperty"] = "BMD: Add property";
    EntityAction["OneToMany"] = "BMD: OneToMany with ";
    EntityAction["ManyToOne"] = "BMD: ManyToOne with ";
    EntityAction["ManyToMany"] = "BMD: ManyToMany with ";
})(EntityAction = exports.EntityAction || (exports.EntityAction = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType["String"] = "STRING";
    PropertyType["Number"] = "NUMBER";
    PropertyType["Boolean"] = "BOOLEAN";
    PropertyType["Text"] = "TEXT";
    PropertyType["Double"] = "DOUBLE";
    PropertyType["BalanceColumn"] = "BALANCE COLUMN";
    PropertyType["IsBlockColumn"] = "IS BLOCK COLUMN";
    PropertyType["IsShowColumn"] = "IS SHOW COLUMN";
})(PropertyType || (PropertyType = {}));
class EntityActionProvider {
    constructor() {
        this.generateRelations = (name1, relation) => __awaiter(this, void 0, void 0, function* () {
            const entities = FsProvider_1.FSProvider.getAllFileInFolder('/src/entity');
            const name2 = yield vscode.window.showQuickPick(entities, { placeHolder: 'Select entity' });
            if (!name2)
                return '';
            const nameTextTypes1 = util_1.getFullTextType(name1);
            const nameTextTypes2 = util_1.getFullTextType(name2);
            let injectString1 = '';
            switch (relation) {
                case EntityAction.OneToMany:
                    injectString1 = `
                @OneToMany(type => {{cap2}}, {{camel2}}s => {{camel2}}s.{{camel1}})
                {{camel2}}s: {{cap2}}[];
                `;
                    break;
                case EntityAction.ManyToOne:
                    injectString1 = `
                @ManyToOne(type => {{cap2}}, {{camel2}} => {{camel2}}.{{camel1}}s)
                {{camel2}}: {{cap2}};
                `;
                    break;
                case EntityAction.ManyToMany:
                    injectString1 = `
                @ManyToOne(type => {{cap2}}, {{camel2}}s => {{camel2}}s.{{camel1}}s)
                {{camel2}}s: {{cap2}}[];
                `;
                    break;
            }
            injectString1 = injectString1.replace(/{{camel1}}/g, nameTextTypes1.camelCase);
            injectString1 = injectString1.replace(/{{camel2}}/g, nameTextTypes2.camelCase);
            injectString1 = injectString1.replace(/{{cap1}}/g, nameTextTypes1.classifyCase);
            injectString1 = injectString1.replace(/{{cap2}}/g, nameTextTypes2.classifyCase);
            return injectString1;
        });
    }
    provideCodeActions(document, range, context) {
        if (this.isEntityProperties(document, range)) {
            const addProperty = this.createEntityFunc(document, range, EntityAction.AddProperty);
            vscode.commands.executeCommand('editor.action.formatDocument');
            return [
                addProperty
            ];
        }
        if (this.isEntityRelations(document, range)) {
            const insertOneToMany = this.createEntityFunc(document, range, EntityAction.OneToMany);
            const insertManyToOne = this.createEntityFunc(document, range, EntityAction.ManyToOne);
            const insertManyToMany = this.createEntityFunc(document, range, EntityAction.ManyToMany);
            vscode.commands.executeCommand('editor.action.formatDocument');
            return [
                insertOneToMany,
                insertManyToOne,
                insertManyToMany
            ];
        }
    }
    isEntityProperties(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text.includes('PROPERTIES');
    }
    isEntityRelations(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text.includes('RELATIONS');
    }
    createEntityFunc(document, range, typeFunc) {
        const entity = new vscode.CodeAction(typeFunc, vscode.CodeActionKind.QuickFix);
        switch (typeFunc) {
            case EntityAction.AddProperty:
                entity.command = {
                    command: typeFunc,
                    title: 'Add property: ',
                    tooltip: 'Add property: ',
                    arguments: [document]
                };
                break;
            case EntityAction.OneToMany:
                entity.command = {
                    command: typeFunc,
                    title: 'OneToMany with:',
                    tooltip: 'OneToMany with:',
                    arguments: [document]
                };
                break;
            case EntityAction.ManyToOne:
                entity.command = {
                    command: typeFunc,
                    title: 'ManyToOne with:',
                    tooltip: 'ManyToOne with:',
                    arguments: [document]
                };
                break;
            case EntityAction.ManyToMany:
                entity.command = {
                    command: typeFunc,
                    title: 'ManyToMany with:',
                    tooltip: 'ManyToMany with:',
                    arguments: [document]
                };
                break;
            default:
                break;
        }
        return entity;
    }
    addProperty(document) {
        return __awaiter(this, void 0, void 0, function* () {
            let template = '';
            const type = yield vscode.window.showQuickPick([
                PropertyType.String,
                PropertyType.Number,
                PropertyType.Boolean,
                PropertyType.Text,
                PropertyType.Double,
                PropertyType.IsBlockColumn,
                PropertyType.IsShowColumn,
                PropertyType.BalanceColumn,
            ]);
            const edit = new vscode.WorkspaceEdit();
            for (let index = 0; index < document.lineCount; index++) {
                const line = document.lineAt(index);
                if (line.text.includes('PROPERTIES')) {
                    switch (type) {
                        case PropertyType.String:
                        case PropertyType.Number:
                        case PropertyType.Boolean:
                        case PropertyType.Double:
                        case PropertyType.Text:
                            template = yield this.generateProperty(type);
                            if (!template)
                                return;
                            edit.insert(document.uri, new vscode.Position(index + 1, 0), template);
                            break;
                        case PropertyType.BalanceColumn:
                            edit.insert(document.uri, new vscode.Position(index + 1, 0), `
                        @Column({ default: 0, width: 20 })
                        @JsonProperty()
                        balance: number;
                        `);
                            break;
                        case PropertyType.IsBlockColumn:
                            edit.insert(document.uri, new vscode.Position(index + 1, 0), `
                        @Column({ default: false })
                        @JsonProperty()
                        isBlock: boolean
                        `);
                            break;
                        case PropertyType.IsShowColumn:
                            edit.insert(document.uri, new vscode.Position(index + 1, 0), `
                        @Column({ default: true })
                        @JsonProperty()
                        isShow: boolean
                        `);
                            break;
                        default:
                            break;
                    }
                }
            }
            vscode.workspace.applyEdit(edit);
        });
    }
    generateProperty(propertyType) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputName = yield vscode.window.showInputBox({ placeHolder: 'Enter property name: ' });
            if (!inputName)
                return '';
            const fullTextType = util_1.getFullTextType(inputName);
            switch (propertyType) {
                case PropertyType.String:
                    return `
                @Column({ default: '' })
                @JsonProperty()
                ${fullTextType.camelCase}: string
                `;
                case PropertyType.Number:
                    return `
                @Column({ default: 0 })
                @JsonProperty()
                ${fullTextType.camelCase}: number
                `;
                case PropertyType.Boolean:
                    return `
                @Column({ default: false })
                @JsonProperty()
                ${fullTextType.camelCase}: boolean
                `;
                case PropertyType.Double:
                    return `
                @Column("double", { default: 0 })
                @JsonProperty()
                ${fullTextType.camelCase}: number
                `;
                case PropertyType.Text:
                    return `
                @Column('text', { default: '' })
                @JsonProperty()
                ${fullTextType.camelCase}: string;
                `;
                default:
                    return '';
            }
        });
    }
    insertEntityFunc(typeFunc, document) {
        return __awaiter(this, void 0, void 0, function* () {
            const edit = new vscode.WorkspaceEdit();
            let entity = 'Entity';
            let template = '';
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
                if (line.text.includes('RELATIONS')) {
                    switch (typeFunc) {
                        case EntityAction.OneToMany:
                            template = yield this.generateRelations(entity, EntityAction.OneToMany);
                            if (!template)
                                return;
                            edit.insert(document.uri, new vscode.Position(index + 1, 0), template);
                            break;
                        case EntityAction.ManyToOne:
                            template = yield this.generateRelations(entity, EntityAction.ManyToOne);
                            if (!template)
                                return;
                            edit.insert(document.uri, new vscode.Position(index + 1, 0), template);
                            break;
                        case EntityAction.ManyToMany:
                            template = yield this.generateRelations(entity, EntityAction.ManyToMany);
                            if (!template)
                                return;
                            edit.insert(document.uri, new vscode.Position(index + 1, 0), template);
                            break;
                        default:
                            break;
                    }
                }
            }
            vscode.workspace.applyEdit(edit);
        });
    }
    getPropertiesEntity(name) {
        const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(`src/entity/${name}.ts`);
        if (!lines.length)
            return;
        const properties = [];
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            if (line.includes('@Column')) {
                let lineProperty = lines[index + 2];
                lineProperty = lineProperty.replace(':', '').replace(';', '');
                const words = lineProperty.split(' ').filter(Boolean);
                if (words.length > 1 && words[1] == 'number')
                    properties.push(words[0]);
                else
                    continue;
            }
        }
        return properties;
    }
}
exports.EntityActionProvider = EntityActionProvider;
EntityActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=EntityProvider copy.js.map