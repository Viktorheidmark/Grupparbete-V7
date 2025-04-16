"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const diagnostics_1 = require("../diagnostics");
const COMMAND = 'code-actions-sample.command';
class Emojinfo {
    provideCodeActions(document, range, context, token) {
        // for each diagnostic entry that has the matching `code`, create a code action command
        return context.diagnostics
            .filter(diagnostic => diagnostic.code === diagnostics_1.EMOJI_MENTION)
            .map(diagnostic => this.createCommandCodeAction(diagnostic));
    }
    createCommandCodeAction(diagnostic) {
        const action = new vscode.CodeAction('Learn more...', vscode.CodeActionKind.QuickFix);
        action.command = { command: COMMAND, title: 'Learn more about emojis', tooltip: 'This will open the unicode emoji page.' };
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        return action;
    }
}
exports.Emojinfo = Emojinfo;
Emojinfo.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=Emojinfo.js.map