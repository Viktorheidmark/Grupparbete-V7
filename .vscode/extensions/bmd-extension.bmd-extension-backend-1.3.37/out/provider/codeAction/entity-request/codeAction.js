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
const FsProvider_1 = require("../../../FsProvider");
const vscode = require("vscode");
const util_1 = require("../../../util");
var EntityRequestAction;
(function (EntityRequestAction) {
    EntityRequestAction["AddProperty"] = "BMD: Add property entity-request";
})(EntityRequestAction = exports.EntityRequestAction || (exports.EntityRequestAction = {}));
class EntityRequestActionProvider {
    provideCodeActions(document, range, context) {
        if (this.isEntityRequestProperties(document, range)) {
            const addProperty = this.createEntityFunc(document, range, EntityRequestAction.AddProperty);
            return [
                addProperty
            ];
        }
    }
    isEntityRequestProperties(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text.includes('PROPERTIES') && document.fileName.includes('entity-request/');
    }
    createEntityFunc(document, range, typeFunc) {
        const entity = new vscode.CodeAction(typeFunc, vscode.CodeActionKind.QuickFix);
        switch (typeFunc) {
            case EntityRequestAction.AddProperty:
                entity.command = {
                    command: typeFunc,
                    title: 'Add property: ',
                    tooltip: 'Add property: ',
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
            let entity = this.getEntityFromEntityRequest(document);
            if (!entity)
                return vscode.window.showInformationMessage('Find not found entity');
            const propertiesInEntity = this.getPropertiesEntity(entity);
            if (!propertiesInEntity.length)
                return vscode.window.showInformationMessage('Find not found properties in entity');
            const propertiesInEntityRequest = this.getPropertiesEntityRequest(document);
            const propertiesNotInEntityRequest = propertiesInEntity.filter(property => {
                if (propertiesInEntityRequest.indexOf(property) == -1)
                    return property;
            });
            if (!propertiesNotInEntityRequest.length)
                return vscode.window.showInformationMessage('All property were selected');
            const property = yield vscode.window.showQuickPick([...propertiesNotInEntityRequest], { ignoreFocusOut: true });
            if (!property)
                return vscode.window.showInformationMessage('No property was selected');
            const edit = new vscode.WorkspaceEdit();
            let template = this.getTemplatePropertyEntity(entity, property);
            if (!template)
                return vscode.window.showInformationMessage('Can not generate template');
            for (let index = 0; index < document.lineCount; index++) {
                const line = document.lineAt(index);
                if (line.text.includes('PROPERTIES')) {
                    edit.insert(document.uri, new vscode.Position(index + 1, 0), template);
                }
            }
            const entityCamel = util_1.getFullTextType(entity).camelCase;
            for (let index = 0; index < document.lineCount; index++) {
                const line = document.lineAt(index);
                if (line.text.includes(`return ${entityCamel}`)) {
                    let templateTo = `${util_1.toLowerCaseFirstLetter(entity)}.${property} = this.${property} \n`;
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), templateTo);
                }
            }
            vscode.workspace.applyEdit(edit);
        });
    }
    getEntityFromEntityRequest(document) {
        let entity = '';
        for (let index = 0; index < document.lineCount; index++) {
            let lineText = document.lineAt(index).text;
            if (lineText.includes('new')) {
                lineText = lineText.replace('()', '');
                const words = lineText.split(' ');
                entity = words[words.length - 1];
                break;
            }
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
    getPropertiesEntityRequest(document) {
        const properties = [];
        for (let index = 0; index < document.lineCount; index++) {
            let lineText = document.lineAt(index).text;
            if (lineText.includes('@JsonProperty') || lineText.includes('Property')) {
                let lineProperty = document.lineAt(index + 1).text;
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
    getTemplatePropertyEntity(name, property) {
        const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(`src/entity/${name}.ts`);
        if (!lines.length)
            return vscode.window.showInformationMessage('Can not read file or file is empty');
        let template = '';
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            const lineDecorator = lines[index + 1];
            const lineProperty = lines[index + 2];
            if (line.includes('@Column') && lineProperty.includes(property + ':')) {
                return template = `
${lineDecorator}
${lineProperty}
                `;
            }
        }
        return template;
    }
}
exports.EntityRequestActionProvider = EntityRequestActionProvider;
EntityRequestActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=codeAction.js.map