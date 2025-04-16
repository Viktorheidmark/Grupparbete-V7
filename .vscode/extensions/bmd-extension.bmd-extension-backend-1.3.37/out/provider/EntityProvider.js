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
    EntityAction["AddProperty"] = "BMD: Add property entity";
    EntityAction["OneToMany"] = "BMD: OneToMany with ";
    EntityAction["ManyToOne"] = "BMD: ManyToOne with ";
    EntityAction["ManyToMany"] = "BMD: ManyToMany with ";
    EntityAction["OneToOne"] = "BMD: OneToOne with ";
})(EntityAction = exports.EntityAction || (exports.EntityAction = {}));
exports.EXPORT_INTERFACE = 'BMD: Export interface';
var EntityFunctionAction;
(function (EntityFunctionAction) {
    EntityFunctionAction["AddRelation"] = "BMD: Add relation";
    EntityFunctionAction["FindOneOrThrowID"] = "BMD: Find one or throw ID";
    EntityFunctionAction["CreateQueryBuilder"] = "BMD: Create query builder";
    EntityFunctionAction["AddBuilderRelation"] = "BMD: Add relation builder";
})(EntityFunctionAction = exports.EntityFunctionAction || (exports.EntityFunctionAction = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType["String"] = "STRING";
    PropertyType["Number"] = "NUMBER";
    PropertyType["Boolean"] = "BOOLEAN";
    PropertyType["Text"] = "TEXT";
    PropertyType["Double"] = "DOUBLE";
    PropertyType["BalanceColumn"] = "BALANCE COLUMN";
    PropertyType["IsBlockColumn"] = "IS BLOCK COLUMN";
    PropertyType["IsDeleteColumn"] = "IS DELETE COLUMN";
})(PropertyType || (PropertyType = {}));
class EntityActionProvider {
    constructor() {
        this.generateRelations = (name1, relation) => __awaiter(this, void 0, void 0, function* () {
            const entities = FsProvider_1.FSProvider.getAllFileInFolder('/src/entity');
            let name2 = yield vscode.window.showQuickPick(entities, { placeHolder: 'Select entity' });
            if (!name2)
                return '';
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
                @ManyToMany(type => {{cap2}}, {{camel2}}s => {{camel2}}s.{{camel1}}s)
                {{camel2}}s: {{cap2}}[];
                `;
                    break;
                case EntityAction.OneToOne:
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
    provideCodeActions(document, range, context) {
        if (this.isEntityProperties(document, range)) {
            const addProperty = this.createEntityAction(document, range, EntityAction.AddProperty);
            return [
                addProperty
            ];
        }
        if (this.isEntityRelations(document, range)) {
            const insertOneToMany = this.createEntityAction(document, range, EntityAction.OneToMany);
            const insertManyToOne = this.createEntityAction(document, range, EntityAction.ManyToOne);
            const insertManyToMany = this.createEntityAction(document, range, EntityAction.ManyToMany);
            const insertOneToOne = this.createEntityAction(document, range, EntityAction.OneToOne);
            return [
                insertOneToMany,
                insertManyToOne,
                insertManyToMany,
                insertOneToOne
            ];
        }
        const entity = this.getEntityFromFunction(document, range);
        const properties = this.getPropertiesEntity(entity);
        const entities = this.getRelationsEntityDeeper(entity).relations;
        let propertyActions = [];
        let entityActions = [];
        const exportInterface = this.createExportInterface(document, range, entity);
        if (properties) {
            propertyActions = properties.map(p => {
                const entity = new vscode.CodeAction(p, vscode.CodeActionKind.QuickFix);
                return entity;
            });
        }
        if (entities) {
            entityActions = entities.map(e => {
                const entity = new vscode.CodeAction(e, vscode.CodeActionKind.QuickFix);
                return entity;
            });
        }
        if (this.isEntityFunction(document, range)) {
            const insertRelation = this.createEntityFunction(document, range, EntityFunctionAction.AddRelation);
            return [
                insertRelation,
                exportInterface,
                ...propertyActions,
                ...entityActions
            ];
        }
        if (this.isEntityClassNotBuilder(document, range)) {
            const insertQueryBuilder = this.createEntityFunction(document, range, EntityFunctionAction.CreateQueryBuilder);
            const insertFindOneID = this.createEntityFunction(document, range, EntityFunctionAction.FindOneOrThrowID);
            return [
                insertFindOneID,
                insertQueryBuilder,
                exportInterface,
                ...propertyActions,
                ...entityActions
            ];
        }
        if (this.isQueryBuilder(document, range)) {
            const insertBuilderRelation = this.createEntityFunction(document, range, EntityFunctionAction.AddBuilderRelation);
            return [
                insertBuilderRelation,
                exportInterface,
                ...propertyActions,
                ...entityActions
            ];
        }
    }
    createExportInterface(document, range, entity) {
        const action = new vscode.CodeAction(exports.EXPORT_INTERFACE, vscode.CodeActionKind.QuickFix);
        action.command = {
            command: exports.EXPORT_INTERFACE,
            title: exports.EXPORT_INTERFACE,
            tooltip: exports.EXPORT_INTERFACE,
            arguments: [document, range, entity]
        };
        return action;
    }
    createInterface(document, range, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const edit = new vscode.WorkspaceEdit();
            const linesProperty = this.getPropertyLinesEntity(entity);
            let line = ``;
            linesProperty.map((l, i) => {
                i == linesProperty.length - 1 ? line += `${l}` : line += `${l} \n`;
            });
            const linesEntity = this.getLineRelationsEntityDeeper(entity);
            linesEntity.map((l, i) => {
                i == linesEntity.length - 1 ? line += `${l}` : line += `${l} \n`;
            });
            let template = `
export interface ${entity} {
${line}
}
        `;
            edit.insert(document.uri, new vscode.Position(0, 0), template);
            vscode.workspace.applyEdit(edit);
        });
    }
    isQueryBuilder(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text.includes('createQueryBuilder');
    }
    isEntityProperties(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text.includes('PROPERTIES') && document.fileName.includes('entity/');
    }
    isEntityRelations(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text.includes('RELATIONS');
    }
    isEntityFunction(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text.includes('find');
    }
    isEntityClass(document, range) {
        const entities = FsProvider_1.FSProvider.getAllFileInFolder('/src/entity');
        const start = range.start;
        const line = document.lineAt(start.line);
        let isIncludesEntity = false;
        entities.map((entity) => {
            if (line.text.includes(entity)) {
                isIncludesEntity = true;
            }
        });
        return isIncludesEntity && !line.text.includes('Controller') && !line.text.includes('Service');
    }
    isEntityClassNotBuilder(document, range) {
        const entities = FsProvider_1.FSProvider.getAllFileInFolder('/src/entity');
        const start = range.start;
        const line = document.lineAt(start.line);
        let isIncludesEntity = false;
        entities.map((entity) => {
            if (line.text.includes(entity)) {
                isIncludesEntity = true;
            }
        });
        return isIncludesEntity && !line.text.includes('Controller') && !line.text.includes('Service') && !line.text.includes('createQueryBuilder');
    }
    createEntityAction(document, range, typeFunc) {
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
            case EntityAction.OneToOne:
                entity.command = {
                    command: typeFunc,
                    title: 'OneToOne with:',
                    tooltip: 'OneToOne with:',
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
                PropertyType.IsDeleteColumn,
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
                        case PropertyType.IsDeleteColumn:
                            edit.insert(document.uri, new vscode.Position(index + 1, 0), `
                        @Column({ default: false, select: false })
                        @JsonProperty()
                        isDeleted: boolean
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
                @Column('text', { nullable: true })
                @JsonProperty()
                ${fullTextType.camelCase}: string;
                `;
                default:
                    return '';
            }
        });
    }
    insertEntityAction(typeFunc, document) {
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
                        case EntityAction.OneToOne:
                            template = yield this.generateRelations(entity, EntityAction.OneToOne);
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
    insertEntityFunction(typeFunc, document, range) {
        return __awaiter(this, void 0, void 0, function* () {
            const edit = new vscode.WorkspaceEdit();
            const entity = this.getEntityFromFunction(document, range);
            if (!entity)
                return vscode.window.showInformationMessage('Can not get entity');
            const relations = this.getRelationsEntity(entity);
            if (!relations.length)
                return vscode.window.showInformationMessage('Not exist any relation');
            const { allLine, mapLines } = this.getAllFunctionLine(document, range);
            if (allLine.includes('relations')) {
                const relationSelected = this.getRelationSelected(mapLines);
                const relationNotSelected = relations.filter((item) => {
                    if (!relationSelected.includes(item))
                        return item;
                });
                if (!relationNotSelected.length)
                    return vscode.window.showInformationMessage('All relation was selected');
                const relation = yield vscode.window.showQuickPick(relationNotSelected);
                if (!relation)
                    return;
                const { template, position } = this.handleExistRelation(relation, mapLines);
                if (!position)
                    return vscode.window.showInformationMessage('Can not find position to insert');
                edit.insert(document.uri, position, template);
            }
            else {
                const relation = yield vscode.window.showQuickPick(relations);
                if (!relation)
                    return vscode.window.showInformationMessage('Please select relation');
                const { template, position } = this.handleNotExistRelation(relation, mapLines);
                if (!position)
                    return vscode.window.showInformationMessage('Can not find position to insert');
                edit.insert(document.uri, position, template);
            }
            vscode.workspace.applyEdit(edit);
        });
    }
    insertQueryBuilder(typeFunc, document, range) {
        return __awaiter(this, void 0, void 0, function* () {
            const edit = new vscode.WorkspaceEdit();
            const entity = this.getEntityFromFunction(document, range);
            if (!entity)
                return vscode.window.showInformationMessage('Can not get entity');
            const fullText = util_1.getFullTextType(entity);
            let template = `.createQueryBuilder('{{camel}}')
            .where({{backtick}}{{camel}}.name LIKE '%{{dollar}}{search}%' AND {{camel}}.isDeleted = false{{backtick}})
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('{{camel}}.id', 'DESC')
            .getManyAndCount()
        `;
            template = template.replace(/{{camel}}/g, fullText.camelCase);
            template = template.replace(/{{cap}}/g, fullText.classifyCase);
            template = template.replace(/{{dollar}}/g, '$');
            template = template.replace(/{{backtick}}/g, '`');
            const start = range.start;
            const line = document.lineAt(start.line);
            edit.insert(document.uri, new vscode.Position(line.lineNumber, line.text.length + 1), template);
            vscode.workspace.applyEdit(edit);
        });
    }
    insertFindOneOrThrow(typeFunc, document, range) {
        return __awaiter(this, void 0, void 0, function* () {
            const edit = new vscode.WorkspaceEdit();
            const entity = this.getEntityFromFunction(document, range);
            if (!entity)
                return vscode.window.showInformationMessage('Can not get entity');
            const fullText = util_1.getFullTextType(entity);
            let template = `.findOneOrThrowId({{camel}}Id, null, '')
        `;
            template = template.replace(/{{camel}}/g, fullText.camelCase);
            template = template.replace(/{{cap}}/g, fullText.classifyCase);
            template = template.replace(/{{dollar}}/g, '$');
            template = template.replace(/{{backtick}}/g, '`');
            const start = range.start;
            const line = document.lineAt(start.line);
            edit.insert(document.uri, new vscode.Position(line.lineNumber, line.text.length + 1), template);
            vscode.workspace.applyEdit(edit);
        });
    }
    insertBuilderRelation(typeFunc, document, range) {
        return __awaiter(this, void 0, void 0, function* () {
            const edit = new vscode.WorkspaceEdit();
            const entity = this.getEntityFromFunction(document, range);
            if (!entity)
                return vscode.window.showInformationMessage('Can not get entity');
            const relations = this.getRelationsEntity(entity);
            if (!relations.length)
                return vscode.window.showInformationMessage('Not exist any relation');
            const relation = yield vscode.window.showQuickPick(relations);
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
            edit.insert(document.uri, new vscode.Position(line.lineNumber + 1, 12), template);
            vscode.workspace.applyEdit(edit);
        });
    }
    getRelationSelected(mapLines) {
        for (const [lineNumber, value] of mapLines.entries()) {
            const matchRelations = value.match(/relations:.*\[/);
            if (matchRelations) {
                const matchRelationsProps = value.match(/('\w*'|'\w*\.\w*')/g);
                if (!matchRelationsProps)
                    return [];
                return matchRelationsProps.map(prop => prop.replace(/'/g, ''));
            }
        }
        return [];
    }
    getEntityFromFunction(document, range) {
        var _a;
        const start = range.start;
        const line = document.lineAt(start.line);
        const entities = line.text.match(/\s[A-Z][A-z]+/);
        if (!((_a = entities) === null || _a === void 0 ? void 0 : _a.length))
            return '';
        const entity = entities[0].replace(' ', '').replace('.', '');
        return entity;
    }
    handleNotExistRelation(relation, mapLines) {
        var _a, _b;
        let template = ``;
        let indexOf = 0;
        const [firstKey, firstValue] = mapLines.entries().next().value;
        const matchBracket = firstValue.match(/(\(\W*[a-zA-Z-_]+,\s{)|(\({)/);
        if ((_a = matchBracket) === null || _a === void 0 ? void 0 : _a.length) {
            const matched = matchBracket[0];
            template = `\nrelations: ['${relation}'],`;
            indexOf = firstValue.indexOf(matched) != -1 ? firstValue.indexOf(matched) + matched.length : 0;
            return { template, position: new vscode.Position(firstKey, indexOf) };
        }
        const matchNoBracket = firstValue.match(/\(\W*[a-zA-Z_-\W][^\)]+|(\()/);
        if ((_b = matchNoBracket) === null || _b === void 0 ? void 0 : _b.length) {
            const matched = matchNoBracket[0];
            template = `{\nrelations: ['${relation}']\n}`;
            if (matched.match(/[a-zA-Z]/)) {
                template = `, {\nrelations: ['${relation}']\n}`;
            }
            indexOf = firstValue.indexOf(matched) != -1 ? firstValue.indexOf(matched) + matched.length : 0;
            return { template, position: new vscode.Position(firstKey, indexOf) };
        }
        return { template, position: null };
    }
    handleExistRelation(relation, mapLines) {
        let template = `'${relation}', `;
        let indexOf = 0;
        for (const [lineNumber, value] of mapLines.entries()) {
            const matchRelations = value.match(/relations:.*\[/);
            if (matchRelations) {
                const matched = matchRelations[0];
                indexOf = value.indexOf(matched) != -1 ? value.indexOf(matched) + matched.length : 0;
                return { template, position: new vscode.Position(lineNumber, indexOf) };
            }
        }
    }
    getAllFunctionLine(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line).text;
        let allLine = line;
        let mapLines = new Map();
        mapLines.set(start.line, line);
        if (line.match(/(\(\W*[a-zA-z]+\))|(\(\))|(\))/g) || line.includes('})')) {
            return { allLine, mapLines };
        }
        const isContinue = true;
        let currentLine = start.line;
        while (isContinue) {
            const nextLine = document.lineAt(currentLine + 1).text;
            allLine += nextLine;
            mapLines.set(currentLine + 1, nextLine);
            if (nextLine.includes('})')) {
                return { allLine, mapLines };
            }
            currentLine += 1;
        }
        return { allLine, mapLines };
    }
    getBuilderRelationsEntity(name) {
        const finalRelation = [];
        const { relations, entities } = this.getRelationsEntityDeeper(name);
        if (!relations || !relations.length)
            return [];
        relations.map((r, i) => {
            finalRelation.push(r);
            const nextRelations = this.getRelationsEntityDeeper(entities[i], name);
            if (relations && relations.length) {
                finalRelation.push(...nextRelations.relations.map((n) => `${r}.${n}`));
            }
        });
        return finalRelation;
    }
    getRelationsEntity(name) {
        const finalRelation = [];
        const { relations, entities } = this.getRelationsEntityDeeper(name);
        if (!relations || !relations.length)
            return [];
        relations.map((r, i) => {
            finalRelation.push(r);
            const nextRelations = this.getRelationsEntityDeeper(entities[i], name);
            if (relations && relations.length) {
                finalRelation.push(...nextRelations.relations.map((n) => `${r}.${n}`));
            }
        });
        return finalRelation;
    }
    getRelationsEntityDeeper(name, nameExcept = '') {
        const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(`src/entity/${name}.ts`);
        if (!lines.length)
            return { relations: [], entities: [] };
        const relations = [];
        const nextEntity = [];
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            if (line.includes('@ManyToMany') || line.includes('@OneToMany') || line.includes('@ManyToOne') || line.includes('@OneToOne')) {
                let lineProperty = lines[index + 1];
                if (lineProperty.includes('@')) {
                    lineProperty = lines[index + 2];
                }
                if (lineProperty.includes('@')) {
                    lineProperty = lines[index + 3];
                }
                lineProperty = lineProperty.replace(':', '').replace(';', '').replace('[]', '');
                if (nameExcept && lineProperty == nameExcept)
                    continue;
                const words = lineProperty.split(' ').filter(Boolean);
                if (words.length > 1) {
                    relations.push(words[0]);
                    nextEntity.push(words[1]);
                }
            }
        }
        return { relations, entities: nextEntity };
    }
    createEntityFunction(document, range, typeFunc) {
        const entity = new vscode.CodeAction(typeFunc, vscode.CodeActionKind.QuickFix);
        switch (typeFunc) {
            case EntityFunctionAction.AddRelation:
                entity.command = {
                    command: typeFunc,
                    title: 'Add relation: ',
                    tooltip: 'Add relation: ',
                    arguments: [document, range]
                };
                break;
            case EntityFunctionAction.CreateQueryBuilder:
                entity.command = {
                    command: typeFunc,
                    title: 'Create query build: ',
                    tooltip: 'Create query build: ',
                    arguments: [document, range]
                };
                break;
            case EntityFunctionAction.FindOneOrThrowID:
                entity.command = {
                    command: typeFunc,
                    title: 'Find one or throw ID: ',
                    tooltip: 'Find one or throw ID: ',
                    arguments: [document, range]
                };
                break;
            case EntityFunctionAction.AddBuilderRelation:
                entity.command = {
                    command: typeFunc,
                    title: 'Add builder relation: ',
                    tooltip: 'Add builder relation: ',
                    arguments: [document, range]
                };
                break;
            default:
                break;
        }
        return entity;
    }
    getPropertiesEntity(name) {
        const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(`src/entity/${name}.ts`);
        if (!lines.length)
            return [];
        const properties = [];
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            if (line.includes('@Column')) {
                let lineProperty = lines[index + 2];
                lineProperty = lineProperty.replace(':', '').replace(';', '');
                const words = lineProperty.split(' ').filter(Boolean);
                if (words.length > 1)
                    properties.push(words[0]);
                else
                    continue;
            }
        }
        return properties;
    }
    getPropertyLinesEntity(name) {
        const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(`src/entity/${name}.ts`);
        if (!lines.length)
            return [];
        const properties = [];
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            if (line.includes('@Column')) {
                let lineProperty = lines[index + 2];
                lineProperty = lineProperty.replace(';', '');
                properties.push(`${lineProperty}`);
            }
        }
        return properties;
    }
    getLineRelationsEntityDeeper(name, nameExcept = '') {
        const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(`src/entity/${name}.ts`);
        if (!lines.length)
            return [];
        const relations = [];
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            if (line.includes('@ManyToMany') || line.includes('@OneToMany') || line.includes('@ManyToOne') || line.includes('@OneToOne')) {
                let lineProperty = lines[index + 1];
                if (lineProperty.includes('@')) {
                    lineProperty = lines[index + 2];
                }
                if (lineProperty.includes('@')) {
                    lineProperty = lines[index + 3];
                }
                relations.push(lineProperty);
            }
        }
        return relations;
    }
}
exports.EntityActionProvider = EntityActionProvider;
EntityActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=EntityProvider.js.map