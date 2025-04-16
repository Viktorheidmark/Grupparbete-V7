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
const constant_1 = require("./constant");
const util_1 = require("../../util");
function handleProperty(document, range) {
    if (isEntityProperties(document, range)) {
        const addProperty = createAddPropertyAction(document, range);
        return [addProperty];
    }
    return [];
}
exports.handleProperty = handleProperty;
function createAddPropertyAction(document, range) {
    const entity = new vscode.CodeAction(constant_1.EntityAction.AddProperty, vscode.CodeActionKind.QuickFix);
    entity.command = {
        command: constant_1.EntityAction.AddProperty,
        title: 'Add property: ',
        tooltip: 'Add property: ',
        arguments: [document]
    };
    return entity;
}
function isEntityProperties(document, range) {
    const start = range.start;
    const line = document.lineAt(start.line);
    return line.text.includes('PROPERTIES') && document.fileName.includes('entity/');
}
function addProperty(document) {
    return __awaiter(this, void 0, void 0, function* () {
        let template = '';
        const type = yield vscode.window.showQuickPick([
            constant_1.PropertyType.String,
            constant_1.PropertyType.Number,
            constant_1.PropertyType.Boolean,
            constant_1.PropertyType.Text,
            constant_1.PropertyType.Double,
            constant_1.PropertyType.IsBlockColumn,
            constant_1.PropertyType.IsDeleteColumn,
            constant_1.PropertyType.BalanceColumn,
        ]);
        const edit = new vscode.WorkspaceEdit();
        for (let index = 0; index < document.lineCount; index++) {
            const line = document.lineAt(index);
            if (line.text.includes('PROPERTIES')) {
                switch (type) {
                    case constant_1.PropertyType.String:
                    case constant_1.PropertyType.Number:
                    case constant_1.PropertyType.Boolean:
                    case constant_1.PropertyType.Double:
                    case constant_1.PropertyType.Text:
                        template = yield generateProperty(type);
                        if (!template)
                            return;
                        edit.insert(document.uri, new vscode.Position(index + 1, 0), template);
                        break;
                    case constant_1.PropertyType.BalanceColumn:
                        edit.insert(document.uri, new vscode.Position(index + 1, 0), `
                    @Column({ default: 0, width: 20 })
                    @JsonProperty()
                    balance: number;
                    `);
                        break;
                    case constant_1.PropertyType.IsBlockColumn:
                        edit.insert(document.uri, new vscode.Position(index + 1, 0), `
                    @Column({ default: false })
                    @JsonProperty()
                    isBlock: boolean
                    `);
                        break;
                    case constant_1.PropertyType.IsDeleteColumn:
                        edit.insert(document.uri, new vscode.Position(index + 1, 0), `
                    @Column({ default: false, select: false })
                    @JsonProperty()
                    isDeleted: boolean
                    `);
                        break;
                    default:
                        break;
                }
            }
        }
        vscode.workspace.applyEdit(edit);
    });
}
exports.addProperty = addProperty;
function generateProperty(propertyType) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputName = yield vscode.window.showInputBox({ placeHolder: 'Enter property name: ' });
        if (!inputName)
            return '';
        const fullTextType = util_1.getFullTextType(inputName);
        switch (propertyType) {
            case constant_1.PropertyType.String:
                return `
            @Column({ default: '' })
            @JsonProperty()
            ${fullTextType.camelCase}: string
            `;
            case constant_1.PropertyType.Number:
                return `
            @Column({ default: 0 })
            @JsonProperty()
            ${fullTextType.camelCase}: number
            `;
            case constant_1.PropertyType.Boolean:
                return `
            @Column({ default: false })
            @JsonProperty()
            ${fullTextType.camelCase}: boolean
            `;
            case constant_1.PropertyType.Double:
                return `
            @Column("double", { default: 0 })
            @JsonProperty()
            ${fullTextType.camelCase}: number
            `;
            case constant_1.PropertyType.Text:
                return `
            @Column('text', { nullable: true })
            @JsonProperty()
            ${fullTextType.camelCase}: string;
            `;
            default:
                return '';
        }
    });
}
//# sourceMappingURL=HandleProperties.js.map