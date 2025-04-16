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
const constant_1 = require("../../../constant");
const FsProvider_1 = require("../../../FsProvider");
const helper_1 = require("./helper");
const util_1 = require("../../../util");
const vscode_1 = require("vscode");
function createAddRelationFunctionAction(document, range) {
    if (isEntityFunction(document, range)) {
        const insertRelation = insertRelations(document, range);
        return [
            insertRelation
        ];
    }
    return [];
}
exports.createAddRelationFunctionAction = createAddRelationFunctionAction;
function isEntityFunction(document, range) {
    const start = range.start;
    const line = document.lineAt(start.line);
    return line.text.includes('find');
}
function isQueryString(document, range) {
    return true;
}
function insertRelations(document, range) {
    const entity = new vscode.CodeAction(constant_1.EntityAction.AddRelation, vscode.CodeActionKind.QuickFix);
    entity.command = {
        command: constant_1.EntityAction.AddRelation,
        title: 'Add relation: ',
        tooltip: 'Add relation: ',
        arguments: [document, range]
    };
    return entity;
}
function insertEntityFunction(typeFunc, document, range) {
    return __awaiter(this, void 0, void 0, function* () {
        const edit = new vscode.WorkspaceEdit();
        const entityObj = helper_1.getEntityFromFunction(document, range);
        const entity = entityObj.text;
        if (!entity)
            return vscode.window.showInformationMessage('Can not get entity');
        const relations = helper_1.getRelationsEntity(entity);
        if (!relations.length)
            return vscode.window.showInformationMessage('Not exist any relation');
        const { allLine, mapLines } = getAllFunctionLine(document, range);
        if (allLine.includes('relations')) {
            const relationSelected = getRelationSelected(mapLines);
            const relationNotSelected = relations.filter((item) => {
                if (!relationSelected.includes(item))
                    return item;
            });
            if (!relationNotSelected.length)
                return vscode.window.showInformationMessage('All relation was selected');
            const relation = yield vscode.window.showQuickPick(relationNotSelected, { ignoreFocusOut: true });
            if (!relation)
                return;
            const { template, position } = handleExistRelation(relation, mapLines);
            if (!position)
                return vscode.window.showInformationMessage('Can not find position to insert');
            edit.insert(document.uri, position, template);
        }
        else {
            const relation = yield vscode.window.showQuickPick(relations, { ignoreFocusOut: true });
            if (!relation)
                return vscode.window.showInformationMessage('Please select relation');
            const { template, position } = handleNotExistRelation(relation, mapLines);
            if (!position)
                return vscode.window.showInformationMessage('Can not find position to insert');
            edit.insert(document.uri, position, template);
        }
        vscode.workspace.applyEdit(edit);
    });
}
exports.insertEntityFunction = insertEntityFunction;
function getAllFunctionLine(document, range) {
    const start = range.start;
    const line = document.lineAt(start.line).text;
    console.log('line:', line);
    let allLine = line;
    console.log('allLine:', allLine);
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
        if (nextLine.includes(')')) {
            return { allLine, mapLines };
        }
        currentLine += 1;
    }
    return { allLine, mapLines };
}
function getRelationSelected(mapLines) {
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
function handleExistRelation(relation, mapLines) {
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
function handleNotExistRelation(relation, mapLines) {
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
function createAddFunctionAction(document, range) {
    if (isEntityClassNotBuilder(document, range)) {
        const insertQueryBuilderPagination = createEntityFunction(document, range, constant_1.EntityAction.CreateQueryBuilderPagination);
        const insertQueryBuilderFindAll = createEntityFunction(document, range, constant_1.EntityAction.CreateQueryBuilderFindAll);
        const insertQueryBuilderFindOne = createEntityFunction(document, range, constant_1.EntityAction.CreateQueryBuilderFindOne);
        const insertFindOneID = createEntityFunction(document, range, constant_1.EntityAction.FindOneOrThrowID);
        return [
            insertFindOneID,
            insertQueryBuilderPagination,
            insertQueryBuilderFindAll,
            insertQueryBuilderFindOne,
        ];
    }
    return [];
}
exports.createAddFunctionAction = createAddFunctionAction;
function isEntityClassNotBuilder(document, range) {
    const entities = FsProvider_1.FSProvider.getAllFileInFolder('/src/entity');
    const start = range.start;
    const line = document.lineAt(start.line);
    let isIncludesEntity = false;
    entities.map((entity) => {
        if (line.text.includes(entity)) {
            isIncludesEntity = true;
        }
    });
    return isIncludesEntity &&
        !line.text.includes('Controller') &&
        !line.text.includes('Service') &&
        !line.text.includes('createQueryBuilder') &&
        !line.text.includes('find');
}
function handleOpenAndScrollToRelation(document, range) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const edit = new vscode.WorkspaceEdit();
        const entityObj = helper_1.getEntityFromFunction(document, range);
        const entity = entityObj.text;
        if (!entity)
            return vscode.window.showInformationMessage('Can not get entity');
        // const activeEditor1 = vscode.window.activeTextEditor;
        // console.log('activeEditor 1:', activeEditor1)
        const distPath = `src/entity/${entity}.ts`;
        let uri = vscode_1.Uri.file(FsProvider_1.FSProvider.getFullPath(distPath));
        yield vscode_1.commands.executeCommand('vscode.openFolder', uri);
        const newDocument = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
        if (!newDocument)
            return vscode.window.showInformationMessage('Can not get new file open');
        const positionRelation = getRelationsCommentLine(distPath);
        console.log('positionRelation:', positionRelation);
        yield vscode_1.commands.executeCommand('moveActiveEditor', { to: 'last', by: 'tab' });
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        const position = (_b = editor) === null || _b === void 0 ? void 0 : _b.selection.active;
        console.log('position:', position);
        editor.selections = [new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0))];
        const result = yield vscode_1.commands.executeCommand('cursorMove', { to: 'up', value: position.line });
        console.log('result:', result);
    });
}
exports.handleOpenAndScrollToRelation = handleOpenAndScrollToRelation;
function getRelationsCommentLine(path) {
    const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(path);
    let position = 0;
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        if (line.includes('RELATIONS'))
            position = index;
    }
    return position;
}
function createEntityFunction(document, range, typeFunc) {
    const entity = new vscode.CodeAction(typeFunc, vscode.CodeActionKind.QuickFix);
    switch (typeFunc) {
        case constant_1.EntityAction.CreateQueryBuilderPagination:
            entity.command = {
                command: typeFunc,
                title: 'Create query build pagination: ',
                tooltip: 'Create query build pagination: ',
                arguments: [document, range]
            };
            break;
        case constant_1.EntityAction.CreateQueryBuilderFindAll:
            entity.command = {
                command: typeFunc,
                title: 'Create query build find all: ',
                tooltip: 'Create query build find all: ',
                arguments: [document, range]
            };
            break;
        case constant_1.EntityAction.CreateQueryBuilderFindOne:
            entity.command = {
                command: typeFunc,
                title: 'Create query build find one: ',
                tooltip: 'Create query build find one: ',
                arguments: [document, range]
            };
            break;
        case constant_1.EntityAction.CreateQueryBuilderFindAll:
            entity.command = {
                command: typeFunc,
                title: 'Create query build find all: ',
                tooltip: 'Create query build find all: ',
                arguments: [document, range]
            };
            break;
        case constant_1.EntityAction.CreateQueryBuilderFindOne:
            entity.command = {
                command: typeFunc,
                title: 'Create query build find one: ',
                tooltip: 'Create query build find one: ',
                arguments: [document, range]
            };
            break;
        case constant_1.EntityAction.FindOneOrThrowID:
            entity.command = {
                command: typeFunc,
                title: 'Find one or throw ID: ',
                tooltip: 'Find one or throw ID: ',
                arguments: [document, range]
            };
            break;
        case constant_1.EntityAction.AddBuilderRelation:
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
function insertQueryBuilder(typeFunc, document, range) {
    return __awaiter(this, void 0, void 0, function* () {
        const edit = new vscode.WorkspaceEdit();
        const entityObj = helper_1.getEntityFromFunction(document, range);
        const entity = entityObj.text;
        if (!entity)
            return vscode.window.showInformationMessage('Can not get entity');
        const fullText = util_1.getFullTextType(entity);
        let template = getTemplateQueryBuilder(typeFunc);
        let where = getWhereQueryBuilder(typeFunc);
        template = template.replace(/{{camel}}/g, fullText.camelCase);
        template = template.replace(/{{cap}}/g, fullText.classifyCase);
        template = template.replace(/{{dollar}}/g, '$');
        template = template.replace(/{{backtick}}/g, '`');
        where = where.replace(/{{camel}}/g, fullText.camelCase);
        where = where.replace(/{{cap}}/g, fullText.classifyCase);
        where = where.replace(/{{dollar}}/g, '$');
        where = where.replace(/{{backtick}}/g, '`');
        const start = range.start;
        const line = document.lineAt(start.line);
        const preLine = document.lineAt(line.lineNumber - 1);
        const preLineLastIndex = preLine.text;
        edit.insert(document.uri, new vscode.Position(line.lineNumber, line.text.length + 1), template);
        edit.insert(document.uri, new vscode.Position(preLine.lineNumber, preLineLastIndex.length), where);
        vscode.workspace.applyEdit(edit);
    });
}
exports.insertQueryBuilder = insertQueryBuilder;
function getWhereQueryBuilder(typeFunc) {
    let template = ``;
    switch (typeFunc) {
        case constant_1.EntityAction.CreateQueryBuilderPagination:
            template = `\n\t\tlet where = {{backtick}}{{camel}}.name LIKE '%{{dollar}}{search}%' AND {{camel}}.isDeleted = false{{backtick}}`;
            break;
        case constant_1.EntityAction.CreateQueryBuilderFindAll:
            template = `\n\t\tlet where = {{backtick}}{{camel}}.isDeleted = false{{backtick}}`;
            break;
        case constant_1.EntityAction.CreateQueryBuilderFindOne:
            template = `\n\t\tlet where = {{backtick}}{{camel}}.isDeleted = false{{backtick}}`;
            break;
    }
    return template;
}
function getTemplateQueryBuilder(typeFunc) {
    let template = ``;
    switch (typeFunc) {
        case constant_1.EntityAction.CreateQueryBuilderPagination:
            template = `.createQueryBuilder('{{camel}}')
            .where(where)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('{{camel}}.id', 'DESC')
            .getManyAndCount()
    `;
            break;
        case constant_1.EntityAction.CreateQueryBuilderFindAll:
            template = `.createQueryBuilder('{{camel}}')
            .where(where)
            .orderBy('{{camel}}.id', 'DESC')
            .getMany()
    `;
            break;
        case constant_1.EntityAction.CreateQueryBuilderFindOne:
            template = `.createQueryBuilder('{{camel}}')
            .where(where)
            .getOne()
    `;
            break;
    }
    return template;
}
function insertFindOneOrThrow(typeFunc, document, range) {
    return __awaiter(this, void 0, void 0, function* () {
        const edit = new vscode.WorkspaceEdit();
        const entityObj = helper_1.getEntityFromFunction(document, range);
        const entity = entityObj.text;
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
exports.insertFindOneOrThrow = insertFindOneOrThrow;
function createGetPropertiesAction(document, range) {
    if (isEntityFunction(document, range)) {
        const insertRelation = insertRelations(document, range);
        return [
            insertRelation
        ];
    }
    return [];
}
exports.createGetPropertiesAction = createGetPropertiesAction;
function insertPropertiesToQuery(document, range, lastIndex, property) {
    return __awaiter(this, void 0, void 0, function* () {
        const edit = new vscode.WorkspaceEdit();
        const entityObj = helper_1.getEntityFromFunction(document, range, true);
        const entity = entityObj.text;
        if (!entity)
            return vscode.window.showInformationMessage('Can not get entity');
        const fullText = util_1.getFullTextType(entity);
        const start = range.start;
        const line = document.lineAt(start.line);
        edit.insert(document.uri, new vscode.Position(line.lineNumber, lastIndex + 1), `.${property}`);
        vscode.workspace.applyEdit(edit);
    });
}
exports.insertPropertiesToQuery = insertPropertiesToQuery;
//# sourceMappingURL=handleFunction.js.map