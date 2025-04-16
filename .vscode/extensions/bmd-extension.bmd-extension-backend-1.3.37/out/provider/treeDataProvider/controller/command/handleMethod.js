"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util_1 = require("../../../../util");
const constant_1 = require("../../../../constant");
function insertControllerFunc(typeFunc, document) {
    var _a;
    if (!document || !document.uri) {
        document = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
    }
    if (!document) {
        vscode.window.showInformationMessage("Cancel: Can not find open document to insert");
        return;
    }
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
                case constant_1.ControllerAction.GetListPagination:
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), generatePagination(entity));
                    break;
                case constant_1.ControllerAction.GetListAll:
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), generateFindAll(entity));
                    break;
                case constant_1.ControllerAction.CreateItem:
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), generateCreateItem(entity));
                    break;
                case constant_1.ControllerAction.UpdateItem:
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), generateUpdateItem(entity));
                    break;
                case constant_1.ControllerAction.CreateItemEntityRequest:
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), generateCreateItemRequest(entity));
                    break;
                case constant_1.ControllerAction.DeleteItemByRemove:
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), generateDeleteByRemove(entity));
                    break;
                case constant_1.ControllerAction.DeleteItemByBlock:
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), generateDeleteByHide(entity));
                    break;
                case constant_1.ControllerAction.Upload:
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), generateUpload(entity));
                    break;
                case constant_1.ControllerAction.UploadResize:
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), generateUploadResize(entity));
                    break;
                case constant_1.ControllerAction.Get:
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), generateGet());
                    break;
                case constant_1.ControllerAction.Post:
                    edit.insert(document.uri, new vscode.Position(index - 1, 0), generatePost());
                    break;
                default:
                    break;
            }
        }
    }
    vscode.workspace.applyEdit(edit);
    vscode.commands.executeCommand('vscode.executeFormatDocumentProvider');
}
exports.insertControllerFunc = insertControllerFunc;
const generateGet = () => {
    let template = `

    // =====================METHOD=====================
    @Get('/')
    @UseAuth(VerificationJWT)
    @Validator({})
    async method(
        @QueryParams('value') value: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {

        return res.sendOK(null)
    }
    `;
    return template;
};
const generatePost = () => {
    let template = `

    // =====================METHOD=====================
    @Post('/')
    @UseAuth(VerificationJWT)
    @Validator({})
    async method(
        @BodyParams('value') value: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {

        return res.sendOK(null)
    }
    `;
    return template;
};
const generatePagination = (name) => {
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
        let where = {{backtick}}{{camel}}.name LIKE :search AND {{camel}}.isDeleted = false {{backtick}}
        const [{{camel}}s, total] = await {{cap}}.createQueryBuilder('{{camel}}')
        .where(where, {search: {{backtick}}%{{dollar}}{search}%{{backtick}} })
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
const generateFindAll = (name) => {
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
    template = template.replace(/sss/g, 'sses');
    return template;
};
const generateCreateItem = (name) => {
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
    template = template.replace(/sss/g, 'sses');
    return template;
};
const generateCreateItemRequest = (name) => {
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
const generateDeleteByRemove = (name) => {
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
const generateDeleteByHide = (name) => {
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
const generateUpload = (name) => {
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
const generateUploadResize = (name) => {
    let template = `

    // =====================UPLOAD IMAGE=====================
    @Post('/upload')
    @UseAuth(VerificationJWT)
    async uploadFile(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @MultipartFile('file') file: Express.Multer.File,
    ) {
        const image = await Jimp.read(file.path)
        image.resize(700, Jimp.AUTO);
        image.quality(80)
        image.writeAsync(file.path)

        file.path = file.path.replace(CONFIG.UPLOAD_DIR, '');

        return res.sendOK(file)
    }
    `;
    return template;
};
const generateUpdateItem = (name) => {
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
//# sourceMappingURL=handleMethod.js.map