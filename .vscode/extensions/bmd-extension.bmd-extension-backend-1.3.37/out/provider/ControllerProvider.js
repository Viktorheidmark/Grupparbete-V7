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
const util_1 = require("../util");
const FsProvider_1 = require("../FsProvider");
var ControllerAction;
(function (ControllerAction) {
    ControllerAction["GetListPagination"] = "BMD: Get list pagination";
    ControllerAction["GetListAll"] = "BMD: Get list all";
    ControllerAction["CreateItem"] = "BMD: Create item";
    ControllerAction["UpdateItem"] = "BMD: Update item";
    ControllerAction["CreateItemEntityRequest"] = "BMD: Create item by entity-request";
    ControllerAction["DeleteItemByRemove"] = "BMD: Delete item by remove";
    ControllerAction["DeleteItemByBlock"] = "BMD: Delete item by hide";
    ControllerAction["Upload"] = "BMD: Upload";
})(ControllerAction = exports.ControllerAction || (exports.ControllerAction = {}));
var ConstructorFunction;
(function (ConstructorFunction) {
    ConstructorFunction["PrivateService"] = "BMD: Private service";
})(ConstructorFunction = exports.ConstructorFunction || (exports.ConstructorFunction = {}));
class ControllerActionProvider {
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
            @Req() req: Request,
            @Res() res: Response,
            @QueryParams('page') page: number = 1,
            @QueryParams('limit') limit: number = 0,
            @QueryParams('search') search: string = '',
        ) {
            const [{{camel}}s, total] = await {{cap}}.createQueryBuilder('{{camel}}')
            .where({{backtick}}{{camel}}.name LIKE "%{{dollar}}{search}%" AND {{camel}}.isDeleted = false {{backtick}})
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('{{camel}}.id', 'DESC')
            .getManyAndCount()
    
            return res.sendOK({ {{camel}}s, total });
        }
        `;
            template = template.replace(/{{camel}}/g, nameTextTypes.camelCase);
            template = template.replace(/{{cap}}/g, nameTextTypes.classifyCase);
            template = template.replace(/{{dollar}}/g, '$');
            template = template.replace(/{{backtick}}/g, '`');
            template = template.replace(/ys/g, 'ies');
            return template;
        };
        this.generateFindAll = (name) => {
            const nameTextTypes = util_1.getFullTextType(name);
            let template = `

        // =====================GET LIST=====================
        @Get('')
        @UseAuth(VerificationJWT)
        @Validator({})
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
            template = template.replace(/ys/g, 'ies');
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
            @HeaderParams('token') token: string,
            @Req() req: Request,
            @Res() res: Response,
            @BodyParams('{{camel}}') {{camel}}: {{cap}}
        ) {
            await {{camel}}.save();
            return res.sendOK({{camel}})
        }
        `;
            template = template.replace(/{{camel}}/g, nameTextTypes.camelCase);
            template = template.replace(/{{cap}}/g, nameTextTypes.classifyCase);
            template = template.replace(/ys/g, 'ies');
            return template;
        };
        this.generateCreateItemRequest = (name) => {
            const nameTextTypes = util_1.getFullTextType(name);
            let template = `
            // =====================CREATE ITEM=====================
            @Post('')
            @UseAuth(VerificationJWT)
            @Validator({
                {{camel}}: Joi.required()
            })
            async create(
                @HeaderParams('token') token: string,
                @Req() req: Request,
                @Res() res: Response,
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
            @HeaderParams("token") token: string,
            @Req() req: Request,
            @Res() res: Response,
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
        this.generateDeleteByHide = (name) => {
            const nameTextTypes = util_1.getFullTextType(name);
            let template = `

        // =====================DELETE=====================
        @Post('/:{{camel}}Id/delete')
        @UseAuth(VerificationJWT)
        @Validator({
        })
        async delete(
            @HeaderParams("token") token: string,
            @Req() req: Request,
            @Res() res: Response,
            @PathParams("{{camel}}Id") {{camel}}Id: number,
        ) {
            let {{camel}} = await {{cap}}.findOneOrThrowId({{camel}}Id)
            {{camel}}.isDeleted = true
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
            @HeaderParams("token") token: string,
            @Req() req: Request,
            @Res() res: Response,
            @MultipartFile('file') file: Express.Multer.File,
        ) {
            file.path = file.path.replace(CONFIG.UPLOAD_DIR, '');
            return res.sendOK(file)
        }
        `;
            return template;
        };
        this.generateUpdateItem = (name) => {
            const nameTextTypes = util_1.getFullTextType(name);
            let template = `

        // =====================UPDATE ITEM=====================
        @Post('/:{{camel}}Id/update')
        @UseAuth(VerificationJWT)
        @Validator({
            {{camel}}: Joi.required(),
            {{camel}}Id: Joi.number().required()
        })
        async update(
            @HeaderParams("token") token: string,
            @Req() req: Request,
            @Res() res: Response,
            @BodyParams("{{camel}}") {{camel}}: {{classify}},
            @PathParams("{{camel}}Id") {{camel}}Id: number,
        ) {
            await {{classify}}.findOneOrThrowId({{camel}}Id)
            {{camel}}.id = +{{camel}}Id
            await {{camel}}.save()
            
            return res.sendOK({{camel}})
        }
        `;
            template = template.replace(/{{camel}}/g, nameTextTypes.camelCase);
            template = template.replace(/{{classify}}/g, nameTextTypes.classifyCase);
            return template;
        };
    }
    provideCodeActions(document, range, context) {
        if (this.isControllerClass(document, range)) {
            const insertGetListPagination = this.createControllerFunc(document, range, ControllerAction.GetListPagination);
            const insertGetListAll = this.createControllerFunc(document, range, ControllerAction.GetListAll);
            insertGetListAll.isPreferred = true;
            // insertGetListAll.
            const insertCreateItem = this.createControllerFunc(document, range, ControllerAction.CreateItem);
            insertCreateItem.isPreferred = true;
            const insertCreateItemEntityRequest = this.createControllerFunc(document, range, ControllerAction.CreateItemEntityRequest);
            insertCreateItemEntityRequest.isPreferred = true;
            const insertDeleteItemByRemove = this.createControllerFunc(document, range, ControllerAction.DeleteItemByRemove);
            const insertDeleteItemByBlock = this.createControllerFunc(document, range, ControllerAction.DeleteItemByBlock);
            const insertUpload = this.createControllerFunc(document, range, ControllerAction.Upload);
            const insertUpdateItem = this.createControllerFunc(document, range, ControllerAction.UpdateItem);
            vscode.commands.executeCommand('editor.action.formatDocument');
            return [
                insertGetListPagination,
                insertGetListAll,
                insertCreateItem,
                insertUpdateItem,
                insertCreateItemEntityRequest,
                insertDeleteItemByRemove,
                insertDeleteItemByBlock,
                insertUpload
            ];
        }
        if (this.isConstructorFunction(document, range)) {
            const insertPrivateService = this.createConstructorFunc(document, range, ConstructorFunction.PrivateService);
            vscode.commands.executeCommand('editor.action.formatDocument');
            return [
                insertPrivateService
            ];
        }
    }
    isControllerClass(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text.includes('Controller') && line.text.includes('class');
    }
    isConstructorFunction(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text.includes('constructor');
    }
    isQueryBuilder(document, range) {
        const start = range.start;
        const line = document.lineAt(start.line);
        return line.text.includes('createQueryBuilder');
    }
    createControllerFunc(document, range, typeFunc) {
        const controller = new vscode.CodeAction(typeFunc, vscode.CodeActionKind.QuickFix);
        switch (typeFunc) {
            case ControllerAction.GetListPagination:
                controller.command = {
                    command: typeFunc,
                    title: 'Get list with pagination.',
                    tooltip: 'Get list with pagination.',
                    arguments: [document]
                };
                break;
            case ControllerAction.GetListAll:
                controller.command = {
                    command: typeFunc,
                    title: 'Get list all.',
                    tooltip: 'Get list all.',
                    arguments: [document]
                };
                break;
            case ControllerAction.CreateItem:
                controller.command = {
                    command: typeFunc,
                    title: 'Create new item by entity.',
                    tooltip: 'Create new item by entity.',
                    arguments: [document]
                };
                break;
            case ControllerAction.UpdateItem:
                controller.command = {
                    command: typeFunc,
                    title: 'Update item.',
                    tooltip: 'Update item.',
                    arguments: [document]
                };
                break;
            case ControllerAction.CreateItemEntityRequest:
                controller.command = {
                    command: typeFunc,
                    title: 'Create new item by entity request.',
                    tooltip: 'Create new item by entity request.',
                    arguments: [document]
                };
                break;
            case ControllerAction.DeleteItemByRemove:
                controller.command = {
                    command: typeFunc,
                    title: 'Delete item by remove.',
                    tooltip: 'Delete item by remove.',
                    arguments: [document]
                };
                break;
            case ControllerAction.DeleteItemByBlock:
                controller.command = {
                    command: typeFunc,
                    title: 'Delete item by block.',
                    tooltip: 'Delete item by block.',
                    arguments: [document]
                };
                break;
            case ControllerAction.Upload:
                controller.command = {
                    command: typeFunc,
                    title: 'Upload.',
                    tooltip: 'Upload.',
                    arguments: [document]
                };
                break;
            default:
                break;
        }
        return controller;
    }
    createConstructorFunc(document, range, typeFunc) {
        const controller = new vscode.CodeAction(typeFunc, vscode.CodeActionKind.QuickFix);
        switch (typeFunc) {
            case ConstructorFunction.PrivateService:
                controller.command = {
                    command: typeFunc,
                    title: 'Insert private service.',
                    tooltip: 'Insert private service.',
                    arguments: [document]
                };
                break;
            default:
                break;
        }
        return controller;
    }
    insertPrivateService(typeFunc, document) {
        return __awaiter(this, void 0, void 0, function* () {
            const edit = new vscode.WorkspaceEdit();
            const services = FsProvider_1.FSProvider.getAllFileInFolder('/src/services');
            const service = yield vscode.window.showQuickPick([...services]);
            if (!service)
                return vscode.window.showInformationMessage('Please select service to complete action');
            const fullTextService = util_1.getFullTextType(service);
            const content = `\nprivate ${fullTextService.camelCase}: ${service},`;
            for (let index = 0; index < document.lineCount; index++) {
                const line = document.lineAt(index).text;
                if (line.includes('constructor')) {
                    const matched = 'constructor(';
                    const indexOf = line.indexOf(matched) != -1 ? line.indexOf(matched) + matched.length : 0;
                    edit.insert(document.uri, new vscode.Position(index, indexOf), content);
                }
            }
            vscode.workspace.applyEdit(edit);
        });
    }
    insertControllerFunc(typeFunc, document) {
        const edit = new vscode.WorkspaceEdit();
        let entity = 'Entity';
        for (let index = 0; index < document.lineCount; index++) {
            const line = document.lineAt(index);
            if (line.text.includes('Controller')) {
                let words = line.text.split(' ');
                words = words.filter((word) => word.includes('Controller'));
                words = words.map((word) => word = word.replace('Controller', ''));
                entity = words[0] || 'Entity';
            }
            if (line.text.includes('END FILE')) {
                switch (typeFunc) {
                    case ControllerAction.GetListPagination:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generatePagination(entity));
                        break;
                    case ControllerAction.GetListAll:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateFindAll(entity));
                        break;
                    case ControllerAction.CreateItem:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateCreateItem(entity));
                        break;
                    case ControllerAction.UpdateItem:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateUpdateItem(entity));
                        break;
                    case ControllerAction.CreateItemEntityRequest:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateCreateItemRequest(entity));
                        break;
                    case ControllerAction.DeleteItemByRemove:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateDeleteByRemove(entity));
                        break;
                    case ControllerAction.DeleteItemByBlock:
                        edit.insert(document.uri, new vscode.Position(index - 1, 0), this.generateDeleteByHide(entity));
                        break;
                    case ControllerAction.Upload:
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
exports.ControllerActionProvider = ControllerActionProvider;
ControllerActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=ControllerProvider.js.map