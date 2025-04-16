"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const COMMAND = 'code-actions-sample.command';
class Controller {
    provideCodeActions(document, range) {
        if (!this.isAtStartOfSmiley(document, range)) {
            return;
        }
        const replaceWithSmileyCatFix = this.createFix(document, range, '😺');
        const replaceWithSmileyFix = this.createFix(document, range, '😀');
        // Marking a single fix as `preferred` means that users can apply it with a
        // single keyboard shortcut using the `Auto Fix` command.
        replaceWithSmileyFix.isPreferred = true;
        const replaceWithSmileyHankyFix = this.createFix(document, range, '💩');
        const commandAction = this.createCommand();
        return [
            replaceWithSmileyCatFix,
            replaceWithSmileyFix,
            replaceWithSmileyHankyFix,
            commandAction
        ];
    }
    isAtStartOfSmiley(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text[start.character] === ':' && line.text[start.character + 1] === ')';
    }
    createFix(document, range, emoji) {
        const fix = new vscode.CodeAction(`Convert to ${emoji}`, vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        fix.edit.replace(document.uri, new vscode.Range(range.start, range.start.translate(0, 2)), emoji);
        return fix;
    }
    createCommand() {
        const action = new vscode.CodeAction('Learn more...', vscode.CodeActionKind.Empty);
        action.command = { command: COMMAND, title: 'Learn more about emojis', tooltip: 'This will open the unicode emoji page.' };
        return action;
    }
}
exports.Controller = Controller;
Controller.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=Emojizer.js.map