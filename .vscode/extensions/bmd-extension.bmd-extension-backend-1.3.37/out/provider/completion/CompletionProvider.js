"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const helper_1 = require("../codeAction/entity/helper");
const util_1 = require("../../util");
const FsProvider_1 = require("../../FsProvider");
exports.CompletionPropertyProvider = vscode.languages.registerCompletionItemProvider('typescript', {
    provideCompletionItems(document, position) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (linePrefix.endsWith('.')) {
            const lineWithoutEndWithDot = linePrefix.slice(0, -1);
            let { text } = util_1.getWordBetweenSpace(lineWithoutEndWithDot, lineWithoutEndWithDot.length - 1);
            let entity = text;
            let isEntity = FsProvider_1.FSProvider.isEntity(entity);
            if (!isEntity) {
                entity = util_1.removePlural(text);
                isEntity = FsProvider_1.FSProvider.isEntity(entity);
            }
            const properties = helper_1.getPropertiesEntity(entity);
            const entities = helper_1.getRelationsEntityDeeper(entity).relations;
            const suggestions = [];
            if (properties) {
                properties.map(p => {
                    const item = new vscode.CompletionItem(`${p.name}`);
                    item.kind = vscode.CompletionItemKind.Field;
                    item.insertText = p.name + ' ';
                    item.detail = `Type: ${p.type}`;
                    suggestions.push(item);
                });
            }
            if (entities) {
                entities.map(p => {
                    const item = new vscode.CompletionItem(p, vscode.CompletionItemKind.Method);
                    suggestions.push(item);
                });
            }
            return suggestions;
        }
        return undefined;
    }
}, '.');
exports.CompletionEntityProvider = vscode.languages.registerCompletionItemProvider('typescript', {
    provideCompletionItems(document, position, token, context) {
        const entities = FsProvider_1.FSProvider.getAllFileInFolder('/src/entity');
        const suggestions = [];
        entities.map(e => {
            const texts = util_1.getFullTextType(e);
            const commitCharacterCompletion = new vscode.CompletionItem(texts.camelCase);
            commitCharacterCompletion.commitCharacters = ['.'];
            commitCharacterCompletion.documentation = new vscode.MarkdownString(`Press '.' to get ${texts.camelCase}`);
            suggestions.push(commitCharacterCompletion);
        });
        return suggestions.length ? suggestions : undefined;
    }
}, 'ctrl + space');
const TRIGGER_QUERY = [
    'A', 'B', 'C', 'I', 'L'
];
exports.CompletionQueryProvider = vscode.languages.registerCompletionItemProvider({ language: 'typescript' }, {
    provideCompletionItems(document, position, token, context) {
        const QUERY_KEYWORDS = [
            { label: 'AND', insert: 'AND ' },
            { label: 'IN', insert: ' IN (:...) ' },
            { label: 'BETWEEN', insert: ' BETWEEN ${} AND ${} ' },
            { label: 'LIKE', insert: "LIKE '%${search}%' " },
            { label: 'CONCAT', insert: "CONCAT( ) " },
            { label: 'IFNULL', insert: "IFNULL( , ) " },
        ];
        const suggestions = [];
        QUERY_KEYWORDS.map(q => {
            const item = new vscode.CompletionItem(`${q.label}`);
            item.kind = vscode.CompletionItemKind.Field;
            item.insertText = q.insert;
            item.detail = q.label;
            suggestions.push(item);
        });
        return suggestions.length ? suggestions : undefined;
    }
}, ...TRIGGER_QUERY);
//# sourceMappingURL=CompletionProvider.js.map