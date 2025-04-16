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
const API_1 = require("../../../../API");
const FsProvider_1 = require("../../../../FsProvider");
const Request_1 = require("../../../../Request");
function createInterface(document, range) {
    return __awaiter(this, void 0, void 0, function* () {
        const entities = FsProvider_1.FSProvider.getAllFileInFolder('/src/entity');
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Uploading: ",
            cancellable: true
        }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            token.onCancellationRequested(() => {
                // console.log("User canceled the long running operation");
            });
            progress.report({ increment: 0 });
            for (let index = 0; index < entities.length; index++) {
                const entity = entities[index];
                const linesProperty = getPropertyLinesEntity(entity, true);
                let line = ``;
                linesProperty.map((l, i) => {
                    i == linesProperty.length - 1 ? line += `${l}` : line += `${l} \n`;
                });
                const linesEntity = getLineRelationsEntityDeeper(entity);
                linesEntity.map((l, i) => {
                    if (i == 0) {
                        line += `\n${l} \n`;
                    }
                    else if (i == linesEntity.length - 1) {
                        line += `${l}`;
                    }
                    else {
                        line += `${l} \n`;
                    }
                });
                let template = `
export interface ${entity} {
${line}
}
`;
                // let doc = await vscode.workspace.openTextDocument({ content: template, language: 'typescript' }); // calls back into the provider
                // await vscode.window.showTextDocument(doc, { preview: false, viewColumn: vscode.ViewColumn.Beside });
                const folders = vscode.workspace.workspaceFolders;
                if (!((_a = folders) === null || _a === void 0 ? void 0 : _a.length))
                    return;
                const projectName = folders[0].name;
                const response = yield Request_1.Request.post(API_1.API.Interface.post, {
                    name: entity,
                    project: projectName,
                    body: template
                });
                if (response) {
                    progress.report({ increment: 100 / entities.length, message: `${entity}` });
                }
            }
        }));
        const p = new Promise(resolve => resolve());
        return p;
    });
}
exports.createInterface = createInterface;
function getEntityFromFilename(filename) {
    const words = filename.split('/');
    const fileWithExtension = words[words.length - 1];
    return fileWithExtension.replace('.ts', '');
}
function getPropertyLinesEntity(name, getComment = false) {
    const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(`src/entity/${name}.ts`);
    if (!lines.length)
        return [];
    const properties = [];
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        if (shouldGetComment(getComment, line)) {
            properties.push(line);
        }
        if (line.includes('@Column') ||
            line.includes('@PrimaryGeneratedColumn')) {
            let lineProperty = lines[index + 1];
            if (lineProperty.includes('JsonProperty') || lineProperty.includes('Property')) {
                lineProperty = lines[index + 2];
            }
            lineProperty = lineProperty.replace(';', '');
            properties.push(`${lineProperty}`);
        }
    }
    const propertiesInCore = getPropertyLinesEntityCore();
    return [...propertiesInCore, ...properties];
}
function shouldGetComment(getComment, line) {
    return getComment &&
        line.startsWith('//') &&
        line.includes('//') &&
        !line.includes('@') &&
        !line.includes('IMPORT') &&
        !line.includes('PROPERTIES') &&
        !line.includes('RELATIONS') &&
        !line.includes('METHODS') &&
        !line.includes('END') &&
        !line.includes(':');
}
function getPropertyLinesEntityCore() {
    const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(`src/core/entity/CoreEntity.ts`);
    if (!lines.length)
        return [];
    const properties = [];
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        if (line.includes('@Column') || line.includes('@PrimaryGeneratedColumn')) {
            let lineProperty = lines[index + 1];
            if (lineProperty.includes('JsonProperty') || lineProperty.includes('Property')) {
                lineProperty = lines[index + 2];
            }
            lineProperty = lineProperty.replace(';', '');
            properties.push(`${lineProperty}`);
        }
    }
    return properties;
}
function getLineRelationsEntityDeeper(name, nameExcept = '') {
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
//# sourceMappingURL=exportInterface.js.map