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
const constant_1 = require("../../../../constant");
const util_1 = require("../../../../util");
function addProperty(document) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let template = '';
        const type = yield vscode.window.showQuickPick([
            constant_1.PropertyType.String,
            constant_1.PropertyType.Number,
            constant_1.PropertyType.Boolean,
            constant_1.PropertyType.Text,
            constant_1.PropertyType.Double,
            constant_1.PropertyType.BalanceColumn,
            constant_1.PropertyType.IsBlockColumn,
            constant_1.PropertyType.TypeColumn,
            constant_1.PropertyType.StatusColumn,
            constant_1.PropertyType.IsDeleteColumn,
        ], { ignoreFocusOut: true });
        const edit = new vscode.WorkspaceEdit();
        if (!document || !document.uri) {
            document = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
        }
        if (!document) {
            return vscode.window.showInformationMessage("Cancel: Can not find open document to insert");
        }
        for (let index = 0; index < document.lineCount; index++) {
            const line = document.lineAt(index);
            if (line.text.includes('RELATIONS')) {
                let lineInsertIndex = index - 2;
                switch (type) {
                    case constant_1.PropertyType.String:
                    case constant_1.PropertyType.Number:
                    case constant_1.PropertyType.Boolean:
                    case constant_1.PropertyType.Double:
                    case constant_1.PropertyType.Text:
                        template = yield generateProperty(type);
                        if (!template)
                            return;
                        edit.insert(document.uri, new vscode.Position(lineInsertIndex, 0), template);
                        break;
                    case constant_1.PropertyType.BalanceColumn:
                        edit.insert(document.uri, new vscode.Position(lineInsertIndex, 0), `
    @Column({ default: 0, width: 20 })
    @Property()
    balance: number;
                    `);
                        break;
                    case constant_1.PropertyType.IsBlockColumn:
                        edit.insert(document.uri, new vscode.Position(lineInsertIndex, 0), `
    @Column({ default: false })
    @Property()
    isBlock: boolean
                    `);
                        break;
                    case constant_1.PropertyType.IsDeleteColumn:
                        edit.insert(document.uri, new vscode.Position(lineInsertIndex, 0), `
    @Column({ default: false, select: false })
    @Property()
    isDeleted: boolean
                    `);
                        break;
                    case constant_1.PropertyType.StatusColumn:
                        edit.insert(document.uri, new vscode.Position(lineInsertIndex, 0), `
    @Column({ default: '' })
    @Property()
    status: string
                    `);
                        break;
                    case constant_1.PropertyType.TypeColumn:
                        edit.insert(document.uri, new vscode.Position(lineInsertIndex, 0), `
    @Column({ default: '' })
    @Property()
    type: string
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
        const inputName = yield vscode.window.showInputBox({
            placeHolder: 'Enter property name: ',
            ignoreFocusOut: true
        });
        if (!inputName)
            return '';
        const fullTextType = util_1.getFullTextType(inputName);
        switch (propertyType) {
            case constant_1.PropertyType.String:
                return `
    @Column({ default: '' })
    @Property()
    ${fullTextType.camelCase}: string
            `;
            case constant_1.PropertyType.Number:
                return `
    @Column({ default: 0 })
    @Property()
    ${fullTextType.camelCase}: number
            `;
            case constant_1.PropertyType.Boolean:
                return `
    @Column({ default: false })
    @Property()
    ${fullTextType.camelCase}: boolean
            `;
            case constant_1.PropertyType.Double:
                return `
    @Column("double", { default: 0 })
    @Property()
    ${fullTextType.camelCase}: number
            `;
            case constant_1.PropertyType.Text:
                return `
    @Column('text', { nullable: true })
    @Property()
    ${fullTextType.camelCase}: string;
            `;
            default:
                return '';
        }
    });
}
//# sourceMappingURL=addProperty.js.map