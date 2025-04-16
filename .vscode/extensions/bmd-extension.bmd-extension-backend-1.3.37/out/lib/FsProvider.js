"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fsExtra = require("fs-extra");
const util_1 = require("./util");
const rootPath = vscode.workspace.rootPath;
class FSProvider {
    static checkExistProject() {
        vscode.window.showInformationMessage('check project');
        const packageJson = path.join(rootPath, 'package.json');
        const env = path.join(rootPath, '.env');
        const srcFolder = path.join(rootPath, 'src');
        vscode.window.showInformationMessage('check project xong');
        return fsExtra.existsSync(packageJson) ||
            fsExtra.existsSync(env) ||
            fsExtra.existsSync(srcFolder);
    }
    static checkExist(distPath) {
        const file = path.join(rootPath, distPath);
        return fsExtra.existsSync(file);
    }
    static copyFile(assetPathFrom, pathTo) {
        try {
            const fullPath = path.join(rootPath, pathTo);
            fsExtra.copy(__dirname + '/assets/' + assetPathFrom, fullPath);
        }
        catch (error) {
            console.log('Error write file:', error);
        }
    }
    static copyAndReplaceFile(assetPathFrom, pathTo, keywords) {
        const fullPath = path.join(rootPath, pathTo);
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
        const fullPath = path.join(rootPath, folderPath);
        fsExtra.ensureDirSync(fullPath);
    }
    static getAllFileInFolder(folderPath) {
        const fullPath = path.join(rootPath, folderPath);
        const files = fsExtra.readdirSync(fullPath);
        return files.map(file => file = file.replace('.ts', ''));
    }
    static getLinesDocumentInFile(folderPath) {
        const fullPath = path.join(rootPath, folderPath);
        const files = fsExtra.readFileSync(fullPath);
        return files.toString().split('\n') || [];
    }
}
exports.FSProvider = FSProvider;
//# sourceMappingURL=FsProvider.js.map