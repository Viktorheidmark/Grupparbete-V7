"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
class Dependency extends vscode.TreeItem {
    constructor(label, collapsibleState, command, context, icon) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.context = context;
        this.icon = icon;
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', 'media', 'light', `${this.icon}.svg`),
            dark: path.join(__filename, '..', '..', '..', '..', 'media', 'dark', `${this.icon}.svg`)
        };
        this.contextValue = this.context;
    }
    get tooltip() {
        return `${this.label}`;
    }
}
exports.Dependency = Dependency;
//# sourceMappingURL=Dependency.js.map