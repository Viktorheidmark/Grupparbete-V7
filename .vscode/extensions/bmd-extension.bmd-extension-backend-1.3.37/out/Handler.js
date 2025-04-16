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
const FsProvider_1 = require("./FsProvider");
const vscode = require("vscode");
const util_1 = require("./util");
var Confirmation;
(function (Confirmation) {
    Confirmation["Yes"] = "YES";
    Confirmation["No"] = "NO";
})(Confirmation || (Confirmation = {}));
var TypeRequest;
(function (TypeRequest) {
    TypeRequest["Insert"] = "Insert";
    TypeRequest["Update"] = "Update";
})(TypeRequest || (TypeRequest = {}));
class Handler {
    static initProject() {
        return __awaiter(this, void 0, void 0, function* () {
            const pass = yield vscode.window.showInputBox({ placeHolder: "Enter password: " });
            if (pass != "bmd1234567890")
                return;
            const projectName = yield vscode.window.showInputBox({ placeHolder: "Enter project name: " });
            if (!projectName)
                return;
            const projectNameTypes = util_1.getFullTextType(projectName);
            const projectCode = yield vscode.window.showInputBox({ placeHolder: "Enter project code: " });
            if (!projectCode)
                return;
            let projectPort = yield vscode.window.showInputBox({ placeHolder: "Use port: " });
            if (!projectPort)
                projectPort = "4000";
            FsProvider_1.FSProvider.copyFile('init/tsconfig.json.txt', 'tsconfig.json');
            FsProvider_1.FSProvider.copyFile('init/deploy.sh.txt', 'deploy.sh');
            FsProvider_1.FSProvider.copyFile('init/config.ts.txt', 'config.ts');
            FsProvider_1.FSProvider.copyFile('init/.gitignore.txt', '.gitignore');
            FsProvider_1.FSProvider.copyFile('init/src/controllers/admin/CustomerController.ts.txt', 'src/controllers/admin/CustomerController.ts');
            FsProvider_1.FSProvider.copyFile('init/src/controllers/admin/RoleController.ts.txt', 'src/controllers/admin/RoleController.ts');
            FsProvider_1.FSProvider.copyFile('init/src/controllers/admin/StaffController.ts.txt', 'src/controllers/admin/StaffController.ts');
            FsProvider_1.FSProvider.copyFile('init/src/controllers/admin/AuthController.ts.txt', 'src/controllers/admin/AuthController.ts');
            FsProvider_1.FSProvider.copyFile('init/src/controllers/customer/CustomerController.ts.txt', 'src/controllers/customer/CustomerController.ts');
            FsProvider_1.FSProvider.copyFile('init/src/controllers/customer/AuthController.ts.txt', 'src/controllers/customer/AuthController.ts');
            FsProvider_1.FSProvider.copyFile('init/src/core/entity/CoreEntity.ts.txt', 'src/core/entity/CoreEntity.ts');
            FsProvider_1.FSProvider.copyFile('init/src/core/services/CoreService.ts.txt', 'src/core/services/CoreService.ts');
            FsProvider_1.FSProvider.copyFile('init/src/entity/Customer.ts.txt', 'src/entity/Customer.ts');
            FsProvider_1.FSProvider.copyFile('init/src/entity/Permission.ts.txt', 'src/entity/Permission.ts');
            FsProvider_1.FSProvider.copyFile('init/src/entity/Role.ts.txt', 'src/entity/Role.ts');
            FsProvider_1.FSProvider.copyFile('init/src/entity/Staff.ts.txt', 'src/entity/Staff.ts');
            FsProvider_1.FSProvider.copyFile('init/src/entity-request/CustomerInsert.ts.txt', 'src/entity-request/CustomerInsert.ts');
            FsProvider_1.FSProvider.copyFile('init/src/entity-request/CustomerUpdate.ts.txt', 'src/entity-request/CustomerUpdate.ts');
            FsProvider_1.FSProvider.copyFile('init/src/entity-request/StaffUpdate.ts.txt', 'src/entity-request/StaffUpdate.ts');
            FsProvider_1.FSProvider.copyFile('init/src/entity-request/PermissionImport.ts.txt', 'src/entity-request/PermissionImport.ts');
            FsProvider_1.FSProvider.copyFile('init/src/middleware/auth/Verification.ts.txt', 'src/middleware/auth/Verification.ts');
            FsProvider_1.FSProvider.copyFile('init/src/middleware/auth/VerificationJWT.ts.txt', 'src/middleware/auth/VerificationJWT.ts');
            FsProvider_1.FSProvider.copyFile('init/src/middleware/auth/strategy/AuthStrategy.ts.txt', 'src/middleware/auth/strategy/AuthStrategy.ts');
            FsProvider_1.FSProvider.copyFile('init/src/middleware/auth/strategy/JWT.ts.txt', 'src/middleware/auth/strategy/JWT.ts');
            FsProvider_1.FSProvider.copyFile('init/src/middleware/error/handleError.ts.txt', 'src/middleware/error/handleError.ts');
            FsProvider_1.FSProvider.copyFile('init/src/middleware/error/handleNotFound.ts.txt', 'src/middleware/error/handleNotFound.ts');
            FsProvider_1.FSProvider.copyFile('init/src/middleware/response/CustomSendResponse.ts.txt', 'src/middleware/response/CustomSendResponse.ts');
            FsProvider_1.FSProvider.copyFile('init/src/middleware/response/responseAPI.ts.txt', 'src/middleware/response/responseAPI.ts');
            FsProvider_1.FSProvider.copyFile('init/src/middleware/validator/Validator.ts.txt', 'src/middleware/validator/Validator.ts');
            FsProvider_1.FSProvider.copyFile('init/src/services/CustomerService.ts.txt', 'src/services/CustomerService.ts');
            FsProvider_1.FSProvider.copyFile('init/src/services/MailService.ts.txt', 'src/services/MailService.ts');
            FsProvider_1.FSProvider.copyFile('init/src/services/StaffService.ts.txt', 'src/services/StaffService.ts');
            FsProvider_1.FSProvider.copyFile('init/src/services/RoleService.ts.txt', 'src/services/RoleService.ts');
            FsProvider_1.FSProvider.copyFile('init/src/services/InitService.ts.txt', 'src/services/InitService.ts');
            FsProvider_1.FSProvider.copyFile('init/src/ssl/certificate-ca.crt', 'src/ssl/certificate-ca.crt');
            FsProvider_1.FSProvider.copyFile('init/src/ssl/certificate.crt', 'src/ssl/certificate.crt');
            FsProvider_1.FSProvider.copyFile('init/src/ssl/private.key', 'src/ssl/private.key');
            FsProvider_1.FSProvider.copyFile('init/src/types/express.d.ts.txt', 'src/types/express.d.ts');
            FsProvider_1.FSProvider.copyFile('init/src/util/helper.ts.txt', 'src/util/helper.ts');
            FsProvider_1.FSProvider.copyFile('init/src/util/mailer.ts.txt', 'src/util/mailer.ts');
            FsProvider_1.FSProvider.copyFile('init/src/util/language.ts.txt', 'src/util/language.ts');
            FsProvider_1.FSProvider.copyFile('init/src/util/logger.ts.txt', 'src/util/logger.ts');
            FsProvider_1.FSProvider.copyFile('init/src/util/expo.ts.txt', 'src/util/expo.ts');
            FsProvider_1.FSProvider.copyFile('init/src/util/password.ts.txt', 'src/util/password.ts');
            FsProvider_1.FSProvider.copyFile('init/src/index.ts.txt', 'src/index.ts');
            FsProvider_1.FSProvider.copyFile('init/src/Server.ts.txt', 'src/Server.ts');
            FsProvider_1.FSProvider.makeFolder('uploads');
            FsProvider_1.FSProvider.makeFolder('log/info');
            FsProvider_1.FSProvider.makeFolder('log/error');
            FsProvider_1.FSProvider.makeFolder('src');
            // FSProvider.copyAndReplaceFile(
            //     'init/package.json.txt',
            //     'package.json',
            //     [{ regex: /{{snake}}/g, value: projectNameTypes.snakeCase }])
            FsProvider_1.FSProvider.copyFile('init/package.json.txt', 'package.json');
            FsProvider_1.FSProvider.copyFile('init/package-lock.json.txt', 'package-lock.json');
            initEnv('init/.env.production.txt', '.env.production');
            initEnv('init/.env.example.txt', '.env.example');
            initEnv('init/.env.example.txt', '.env');
            function initEnv(from, to) {
                FsProvider_1.FSProvider.copyAndReplaceFile(from, to, [
                    { regex: /{{snake}}/g, value: projectNameTypes.snakeCase },
                    { regex: /{{snake_upper}}/g, value: projectNameTypes.snakeUpperCase },
                    { regex: /{{upper}}/g, value: projectNameTypes.upperCase },
                    { regex: /{{code}}/g, value: projectCode },
                    { regex: /{{code_upper}}/g, value: projectCode.toUpperCase() },
                    { regex: /{{port}}/g, value: projectPort }
                ]);
            }
        });
    }
    static addContentDefine() {
        return __awaiter(this, void 0, void 0, function* () {
            // if (FSProvider.checkExist())
            FsProvider_1.FSProvider.copyFile('contentDefine/AdminContentDefineController.ts.txt', 'src/controllers/admin/ContentDefineController.ts');
            FsProvider_1.FSProvider.copyFile('contentDefine/CustomerContentDefineController.ts.txt', 'src/controllers/customer/ContentDefineController.ts');
            FsProvider_1.FSProvider.copyFile('contentDefine/ContentDefine.ts.txt', 'src/entity/ContentDefine.ts');
            FsProvider_1.FSProvider.copyFile('contentDefine/ContentDefineService.ts.txt', 'src/services/ContentDefineService.ts');
        });
    }
    static addConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            FsProvider_1.FSProvider.copyFile('configuration/AdminConfigurationController.ts.txt', 'src/controllers/admin/ConfigurationController.ts');
            FsProvider_1.FSProvider.copyFile('configuration/Configuration.ts.txt', 'src/entity/Configuration.ts');
            FsProvider_1.FSProvider.copyFile('configuration/ConfigurationService.ts.txt', 'src/services/ConfigurationService.ts');
        });
    }
    static createController(fsPath, assetPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fsPath.includes('controllers/'))
                return vscode.window.showErrorMessage("Please select subfolder in 'controllers'");
            const lastFolder = util_1.getLastFolderFromPath(fsPath);
            let controller = yield vscode.window.showInputBox({ placeHolder: "Enter controller name: " });
            if (!controller)
                return;
            controller = controller.replace('controller', '').replace('Controller', '');
            const controllerTextTypes = util_1.getFullTextType(controller);
            const lastFolderTextTypes = util_1.getFullTextType(lastFolder);
            const distPath = `src/controllers/${lastFolder}/${controllerTextTypes.classifyCase}Controller.ts`;
            if (FsProvider_1.FSProvider.checkExist(distPath)) {
                const confirm = yield vscode.window.showQuickPick([Confirmation.Yes, Confirmation.No], { placeHolder: "This file already exist in this folder. Do you want to replace it." });
                if (confirm != Confirmation.Yes)
                    return;
            }
            const controllerPath = `/${lastFolderTextTypes.snakeCase}/${controllerTextTypes.camelCase}`;
            FsProvider_1.FSProvider.copyAndReplaceFile(assetPath, distPath, [
                { regex: /{{snake}}/g, value: controllerTextTypes.snakeCase },
                { regex: /{{classify}}/g, value: controllerTextTypes.classifyCase },
                { regex: /{{controller}}/g, value: controllerPath },
                { regex: /{{docs}}/g, value: lastFolderTextTypes.snakeCase },
                { regex: /{{camel}}/g, value: controllerTextTypes.camelCase }
            ]);
        });
    }
    static createControllerNormal(fsPath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.createController(fsPath, 'controller/controller.txt');
        });
    }
    static createControllerResource(fsPath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.createController(fsPath, 'controller/controllerResource.txt');
        });
    }
    static createService(fsPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fsPath.includes('services'))
                return vscode.window.showErrorMessage("Please select 'services' folder");
            let service = yield vscode.window.showInputBox({ placeHolder: "Enter service name: " });
            if (!service)
                return;
            service = service.replace('service', '').replace('Service', '');
            const serviceTextTypes = util_1.getFullTextType(service);
            const distPath = `src/services/${serviceTextTypes.classifyCase}Service.ts`;
            if (FsProvider_1.FSProvider.checkExist(distPath)) {
                const confirm = yield vscode.window.showQuickPick([Confirmation.Yes, Confirmation.No], { placeHolder: "This file already exist in this folder. Do you want to replace it." });
                if (confirm != Confirmation.Yes)
                    return;
            }
            FsProvider_1.FSProvider.copyAndReplaceFile('service/service.txt', distPath, [
                { regex: /{{snake}}/g, value: serviceTextTypes.snakeCase },
                { regex: /{{classify}}/g, value: serviceTextTypes.classifyCase },
                { regex: /{{camel}}/g, value: serviceTextTypes.camelCase }
            ]);
        });
    }
    static createEntity(fsPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fsPath.endsWith('entity'))
                return vscode.window.showErrorMessage("Please select 'entity' folder");
            let entity = yield vscode.window.showInputBox({ placeHolder: "Enter entity name: " });
            if (!entity)
                return;
            const entityTextTypes = util_1.getFullTextType(entity);
            const distPath = `src/entity/${entityTextTypes.classifyCase}.ts`;
            if (FsProvider_1.FSProvider.checkExist(distPath)) {
                const confirm = yield vscode.window.showQuickPick([Confirmation.Yes, Confirmation.No], { placeHolder: "This file already exist in this folder. Do you want to replace it." });
                if (confirm != Confirmation.Yes)
                    return;
            }
            FsProvider_1.FSProvider.copyAndReplaceFile('entity/entity.txt', distPath, [
                { regex: /{{snake}}/g, value: entityTextTypes.snakeCase },
                { regex: /{{classify}}/g, value: entityTextTypes.classifyCase },
                { regex: /{{camel}}/g, value: entityTextTypes.camelCase }
            ]);
        });
    }
    static createEntityRequest(fsPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fsPath.endsWith('entity-request'))
                return vscode.window.showErrorMessage("Please select 'entity-request' folder");
            const entities = FsProvider_1.FSProvider.getAllFileInFolder('/src/entity');
            const entity = yield vscode.window.showQuickPick([...entities]);
            if (!entity)
                return vscode.window.showInformationMessage('Please select entity to complete action');
            const type = yield vscode.window.showQuickPick([TypeRequest.Insert, TypeRequest.Update]);
            if (!type)
                return vscode.window.showInformationMessage('Please select type to complete action');
            const entityRequestTextTypes = util_1.getFullTextType(entity + type);
            const entityTextTypes = util_1.getFullTextType(entity);
            const distPath = `src/entity-request/${entityRequestTextTypes.classifyCase}.ts`;
            if (FsProvider_1.FSProvider.checkExist(distPath)) {
                const confirm = yield vscode.window.showQuickPick([Confirmation.Yes, Confirmation.No], { placeHolder: "This file already exist in this folder. Do you want to replace it." });
                if (confirm != Confirmation.Yes)
                    return;
            }
            FsProvider_1.FSProvider.copyAndReplaceFile('entity-request/entity-request.txt', distPath, [
                { regex: /{{snake}}/g, value: entityTextTypes.snakeCase },
                { regex: /{{classify}}/g, value: entityTextTypes.classifyCase },
                { regex: /{{classifyRaw}}/g, value: entityRequestTextTypes.classifyCase },
                { regex: /{{camel}}/g, value: entityTextTypes.camelCase }
            ]);
        });
    }
}
exports.default = Handler;
//# sourceMappingURL=Handler.js.map