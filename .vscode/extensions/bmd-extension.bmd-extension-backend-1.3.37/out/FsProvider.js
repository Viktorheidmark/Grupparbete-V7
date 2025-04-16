"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fsExtra = require("fs-extra");
const util_1 = require("./util");
exports.ROOT_PATH = vscode.workspace.rootPath;
class FSProvider {
    static checkExistProject() {
        vscode.window.showInformationMessage('check project');
        const packageJson = path.join(exports.ROOT_PATH, 'package.json');
        const env = path.join(exports.ROOT_PATH, '.env');
        const srcFolder = path.join(exports.ROOT_PATH, 'src');
        vscode.window.showInformationMessage('check project xong');
        return fsExtra.existsSync(packageJson) ||
            fsExtra.existsSync(env) ||
            fsExtra.existsSync(srcFolder);
    }
    static isEntity(entity) {
        const entities = FSProvider.getAllFileInFolder('/src/entity');
        let name = util_1.getFullTextType(entity).classifyCase;
        return entities.includes(name);
    }
    static checkExist(distPath) {
        const file = path.join(exports.ROOT_PATH, distPath);
        return fsExtra.existsSync(file);
    }
    static copyFile(assetPathFrom, pathTo) {
        try {
            const fullPath = path.join(exports.ROOT_PATH, pathTo);
            fsExtra.copy(__dirname + '/assets/' + assetPathFrom, fullPath);
        }
        catch (error) {
            console.log('Error write file:', error);
        }
    }
    static copyAndReplaceFile(assetPathFrom, pathTo, keywords) {
        const fullPath = path.join(exports.ROOT_PATH, pathTo);
        const buffer = fsExtra.readFileSync(__dirname + '/assets/' + assetPathFrom);
        let content = buffer.toString();
        content = util_1.replaceSymbolTemplate(content);
        keywords.forEach(pair => {
            content = content.replace(pair.regex, pair.value);
        });
        fsExtra.ensureFileSync(fullPath);
        fsExtra.writeFileSync(fullPath, content);
    }
    static makeFolder(folderPath) {
        const fullPath = path.join(exports.ROOT_PATH, folderPath);
        fsExtra.ensureDirSync(fullPath);
    }
    static getAllFileInFolder(folderPath) {
        const fullPath = path.join(exports.ROOT_PATH, folderPath);
        const files = fsExtra.readdirSync(fullPath);
        return files.map(file => file = file.replace('.ts', ''));
    }
    static getAllFolderInFolder(folderPath) {
        const fullPath = path.join(exports.ROOT_PATH, folderPath);
        const files = fsExtra.readdirSync(fullPath);
        return files.map(file => file = file.replace('.ts', ''));
    }
    static getLinesDocumentInFile(folderPath) {
        try {
            const fullPath = path.join(exports.ROOT_PATH, folderPath);
            const files = fsExtra.readFileSync(fullPath);
            const lines = files.toString().split('\n').map(line => line.trim());
            return lines || [];
        }
        catch (error) {
            return [];
        }
    }
    static getContentInFile(folderPath) {
        const fullPath = path.join(exports.ROOT_PATH, folderPath);
        const files = fsExtra.readFileSync(fullPath);
        return files.toString();
    }
    static isValidStructure() {
        return FSProvider.checkExist('src/Server.ts');
    }
    static getFullPath(pathStr) {
        return path.join(exports.ROOT_PATH, pathStr);
    }
}
exports.FSProvider = FSProvider;
//# sourceMappingURL=FsProvider.js.map