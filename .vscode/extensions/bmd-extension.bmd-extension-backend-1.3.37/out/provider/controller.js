"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util_1 = require("../util");
var ControllerProvider;
(function (ControllerProvider) {
    ControllerProvider["GetListPagination"] = "BMD: Get list pagination";
    ControllerProvider["GetListAll"] = "BMD: Get list all";
    ControllerProvider["CreateItem"] = "BMD: Create item";
    ControllerProvider["CreateItemEntityRequest"] = "BMD: Create item by entity-request";
    ControllerProvider["DeleteItemByRemove"] = "BMD: Delete item by remove";
    ControllerProvider["DeleteItemByBlock"] = "BMD: Delete item by block";
    ControllerProvider["Upload"] = "BMD: Upload";
})(ControllerProvider || (ControllerProvider = {}));
class Controller {
    constructor() {
        this.generatePagination = (name) => {
            const nameTextTypes = util_1.getFullTextType(name);
            let template = `

        // =====================GET LIST=====================
        @Get('')
        @UseAuth(VerificationJWT)
        @Validator({
            page: Joi.number().min(0),
            limit: Joi.number().min(0)
        })
        async findAll(
            @HeaderParams('token') token: string,
            @QueryParams('page') page: number,
            @QueryParams('limit') limit: number,
            @QueryParams('search') search: string = '',
            @Req() req: Request,
            @Res() res: Response
        ) {
            const [{{camel}}s, total] = await {{cap}}.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    name: Raw( alias => {{backtick}}concat({{dollar}}{ alias}, " ", phone) LIKE "%{{dollar}}{search}%"{{backtick}} ),
                    // name: Like({{backtick}}% {{dollar}}{ search }%{{backtick}})
                },
                order: { id: 'DESC' }
            });
    
            return res.sendOK({ {{camel}}s, total });
        }
        `;
            template = template.replace(/{{camel}}/g, nameTextTypes.camelCase);
            template = template.replace(/{{cap}}/g, nameTextTypes.classifyCase);
            template = template.replace(/{{dollar}}/g, '$');
            template = template.replace(/{{backtick}}/g, '`');
            return template;
        };
        this.generateFindAll = (name) => {
            const nameTextTypes = util_1.getFullTextType(name);
            let template = `

        // =====================GET LIST=====================
        @Get('')
        @UseAuth(VerificationJWT)
        @Validator({
            page: Joi.number().min(0),
            limit: Joi.number().min(0)
        })
        async findAll(
            @HeaderParams('token') token: string,
            @Req() req: Request,
            @Res() res: Response
        ) {
            const {{camel}}s = await {{cap}}.find()
            return res.sendOK({{camel}}s)
        }
        `;
            template = template.replace(/{{camel}}/g, nameTextTypes.camelCase);
            template = template.replace(/{{cap}}/g, nameTextTypes.classifyCase);
            return template;
        };
        this.generateCreateItem = (name) => {
            const nameTextTypes = util_1.getFullTextType(name);
            let template = `

        // =====================CREATE ITEM=====================
        @Post('')
        @UseAuth(VerificationJWT)
        @Validator({
            {{camel}}: Joi.required()
        })
        async create(
            @Req() req: Request,
            @Res() res: Response,
            @HeaderParams('token') token: string,
            @BodyParams('{{camel}}') {{camel}}: {{cap}}
        ) {
            await {{camel}}.save();
            return res.sendOK({{camel}})
        }
        `;
            template = template.replace(/{{camel}}/g, nameTextTypes.camelCase);
            template = template.replace(/{{cap}}/g, nameTextTypes.classifyCase);
            return template;
        };
        this.generateCreateItemRequest = (name) => {
            vscode.window.showInformationMessage("Hello");
            const nameTextTypes = util_1.getFullTextType(name);
            let template = `
            // =====================CREATE ITEM=====================
            @Post('')
            @UseAuth(VerificationJWT)
            @Validator({
                {{camel}}: Joi.required()
            })
            async create(
                @Req() req: Request,
                @Res() res: Response,
                @HeaderParams('token') token: string,
                @BodyParams('{{camel}}') {{camel}}: {{cap}}Insert
            ) {
                const new{{cap}} = {{camel}}.to{{cap}}();
                await new{{cap}}.save();
                return new{{cap}};
            }
            `;
            template = template.replace(/{{camel}}/g, nameTextTypes.camelCase);
            template = template.replace(/{{cap}}/g, nameTextTypes.classifyCase);
            return template;
        };
        this.generateDeleteByRemove = (name) => {
            const nameTextTypes = util_1.getFullTextType(name);
            let template = `

        // =====================DELETE=====================
        @Post('/:{{camel}}Id/delete')
        @UseAuth(VerificationJWT)
        @Validator({
        })
        async delete(
            @Req() req: Request,
            @Res() res: Response,
            @HeaderParams("token") token: string,
            @PathParams("{{camel}}Id") {{camel}}Id: number,
        ) {
            let {{camel}} = await {{cap}}.findOneOrThrowId({{camel}}Id)
            await {{camel}}.remove()
            return res.sendOK({{camel}})
        }
        `;
            template = template.replace(/{{camel}}/g, nameTextTypes.camelCase);
            template = template.replace(/{{cap}}/g, nameTextTypes.classifyCase);
            return template;
        };
        this.generateDeleteByBlock = (name) => {
            const nameTextTypes = util_1.getFullTextType(name);
            let template = `

        // =====================DELETE=====================
        @Post('/:{{camel}}Id/delete')
        @UseAuth(VerificationJWT)
        @Validator({
        })
        async delete(
            @Req() req: Request,
            @Res() res: Response,
            @HeaderParams("token") token: string,
            @PathParams("{{camel}}Id") {{camel}}Id: number,
        ) {
            let {{camel}} = await {{cap}}.findOneOrThrowId({{camel}}Id)
            {{camel}}.isBlock = true
            await {{camel}}.save()
            return res.sendOK({{camel}})
        }
        `;
            template = template.replace(/{{camel}}/g, nameTextTypes.camelCase);
            template = template.replace(/{{cap}}/g, nameTextTypes.classifyCase);
            return template;
        };
        this.generateUpload = (name) => {
            let template = `

        // =====================UPLOAD IMAGE=====================
        @Post('/upload')
        @UseAuth(VerificationJWT)
        uploadFile(
            @MultipartFile('file') file: Express.Multer.File,
            @HeaderParams('token') token: string
        ) {
            file.path = file.path.replace(CONFIG.UPLOAD_DIR, '');
            return file;
        }
        `;
            return template;
        };
    }
    provideCodeActions(document, range, context) {
        var _a;
        if (!this.isControllerClass(document, range) || ((_a = context.only) === null || _a === void 0 ? void 0 : _a.value) == 'quickfix') {
            return;
        }
        const insertGetListPagination = this.createControllerFunc(document, range, ControllerProvider.GetListPagination);
        const insertGetListAll = this.createControllerFunc(document, range, ControllerProvider.GetListAll);
        insertGetListAll.isPreferred = true;
        // insertGetListAll.
        const insertCreateItem = this.createControllerFunc(document, range, ControllerProvider.CreateItem);
        insertCreateItem.isPreferred = true;
        const insertCreateItemEntityRequest = this.createControllerFunc(document, range, ControllerProvider.CreateItemEntityRequest);
        insertCreateItemEntityRequest.isPreferred = true;
        const insertDeleteItemByRemove = this.createControllerFunc(document, range, ControllerProvider.DeleteItemByRemove);
        const insertDeleteItemByBlock = this.createControllerFunc(document, range, ControllerProvider.DeleteItemByBlock);
        const insertUpload = this.createControllerFunc(document, range, ControllerProvider.Upload);
        vscode.commands.executeCommand('editor.action.formatDocument');
        return [
            insertGetListPagination,
            insertGetListAll,
            insertCreateItem,
            insertCreateItemEntityRequest,
            insertDeleteItemByRemove,
            insertDeleteItemByBlock,
            insertUpload
        ];
    }
    isControllerClass(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text.includes('Controller') && line.text.includes('class');
    }
    createControllerFunc(document, range, typeFunc) {
        const controller = new vscode.CodeAction(typeFunc, vscode.CodeActionKind.QuickFix);
        controller.command = {
            command: typeFunc,
            title: 'Get list with pagination.',
            tooltip: 'Get list with pagination.'
        };
        switch (typeFunc) {
            case ControllerProvider.GetListPagination:
                controller.command = {
                    command: typeFunc,
                    title: 'Get list with pagination.',
                    tooltip: 'Get list with pagination.'
                };
                break;
            case ControllerProvider.GetListAll:
                controller.command = {
                    command: typeFunc,
                    title: 'Get list all.',
                    tooltip: 'Get list all.'
                };
                break;
            case ControllerProvider.CreateItem:
                controller.command = {
                    command: typeFunc,
                    title: 'Create new item by entity.',
                    tooltip: 'Create new item by entity.'
                };
                break;
            case ControllerProvider.CreateItemEntityRequest:
                controller.command = {
                    command: typeFunc,
                    title: 'Create new item by entity request.',
                    tooltip: 'Create new item by entity request.'
                };
                break;
            case ControllerProvider.DeleteItemByRemove:
                controller.command = {
                    command: typeFunc,
                    title: 'Delete item by remove.',
                    tooltip: 'Delete item by remove.'
                };
                break;
            case ControllerProvider.DeleteItemByBlock:
                controller.command = {
                    command: typeFunc,
                    title: 'Delete item by block.',
                    tooltip: 'Delete item by block.'
                };
                break;
            case ControllerProvider.Upload:
                controller.command = {
                    command: typeFunc,
                    title: 'Upload.',
                    tooltip: 'Upload.'
                };
                break;
            default:
                break;
        }
        return controller;
    }
    insertControllerFunc(typeFunc) {
        const documents = vscode.workspace.textDocuments;
        const document = documents[0];
        const edit = new vscode.WorkspaceEdit();
        let entity = 'Entity';
        for (let index = 0; index < document.lineCount; index++) {
            const line = document.lineAt(index);
            if (line.text.includes('Controller')) {
                let words = line.text.split(' ');
                words = words.filter(word => word.includes('Controller'));
                words = words.map(word => word = word.replace('Controller', ''));
                entity = words[0] || 'Entity';
            }
            if (line.text.includes('END FILE')) {
                switch (typeFunc) {
                    case ControllerProvider.GetListPagination:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generatePagination(entity));
                        break;
                    case ControllerProvider.GetListAll:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateFindAll(entity));
                        break;
                    case ControllerProvider.CreateItem:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateCreateItem(entity));
                        break;
                    case ControllerProvider.CreateItemEntityRequest:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateCreateItemRequest(entity));
                        break;
                    case ControllerProvider.DeleteItemByRemove:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateDeleteByRemove(entity));
                        break;
                    case ControllerProvider.DeleteItemByBlock:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateDeleteByBlock(entity));
                        break;
                    case ControllerProvider.Upload:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateUpload(entity));
                        break;
                    default:
                        break;
                }
            }
        }
        vscode.workspace.applyEdit(edit);
    }
}
exports.Controller = Controller;
Controller.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=Controller.js.map