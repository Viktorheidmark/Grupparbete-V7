"use strict";
const provider2 = vscode.languages.registerCompletionItemProvider('plaintext', {
    provideCompletionItems(document, position) {
        // get all text until the `position` and check if it reads `console.`
        // and if so then complete if `log`, `warn`, and `error`
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith('console.')) {
            return undefined;
        }
        return [
            new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
            new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
        ];
    }
}, '.' // triggered whenever a '.' is being typed
);
//# sourceMappingURL=Provider.js.map