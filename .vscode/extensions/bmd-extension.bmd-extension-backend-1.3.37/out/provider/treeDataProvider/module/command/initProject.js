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
const FsProvider_1 = require("../../../../FsProvider");
const constant_1 = require("../../../../constant");
const util_1 = require("../../../../util");
function initProject() {
    return __awaiter(this, void 0, void 0, function* () {
        if (FsProvider_1.FSProvider.checkExist('src')) {
            const confirm = yield vscode.window.showQuickPick([constant_1.Confirmation.No, constant_1.Confirmation.Yes], {
                placeHolder: 'Already exist project. You want to replace it??? ',
                ignoreFocusOut: true
            });
            if (!confirm || confirm == constant_1.Confirmation.No) {
                return vscode.window.showInformationMessage("Cancel! Init project.");
            }
        }
        const pass = yield vscode.window.showInputBox({
            placeHolder: "Enter password: ",
            ignoreFocusOut: true,
            password: true
        });
        if (pass != "bmd1234567890") {
            return vscode.window.showInformationMessage("Cancel! Wrong password.");
        }
        const projectName = yield vscode.window.showInputBox({
            placeHolder: "Enter project name: ",
            ignoreFocusOut: true
        });
        if (!projectName) {
            return vscode.window.showInformationMessage("Cancel! Do not input project name.");
        }
        const projectCode = yield vscode.window.showInputBox({
            placeHolder: "Enter project code: ",
            ignoreFocusOut: true
        });
        if (!projectCode) {
            return vscode.window.showInformationMessage("Cancel! Do not input project code.");
        }
        const projectNameTypes = util_1.getFullTextType(projectName);
        let projectPort = yield vscode.window.showInputBox({
            placeHolder: "Use port: (default port 4000)",
            ignoreFocusOut: true
        });
        if (!projectPort)
            projectPort = "4000";
        FsProvider_1.FSProvider.copyFile('init/tsconfig.json.txt', 'tsconfig.json');
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
        FsProvider_1.FSProvider.copyFile('init/src/ssl/certificate-ca.crt', 'src/ssl/production/certificate-ca.crt');
        FsProvider_1.FSProvider.copyFile('init/src/ssl/certificate.crt', 'src/ssl/production/certificate.crt');
        FsProvider_1.FSProvider.copyFile('init/src/ssl/private.key', 'src/ssl/production/private.key');
        FsProvider_1.FSProvider.copyFile('init/src/ssl/certificate-ca.crt', 'src/ssl/staging/certificate-ca.crt');
        FsProvider_1.FSProvider.copyFile('init/src/ssl/certificate.crt', 'src/ssl/staging/certificate.crt');
        FsProvider_1.FSProvider.copyFile('init/src/ssl/private.key', 'src/ssl/staging/private.key');
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
        FsProvider_1.FSProvider.copyFile('init/package.json.txt', 'package.json');
        FsProvider_1.FSProvider.copyFile('init/package-lock.json.txt', 'package-lock.json');
        initEnv('init/.env.production.txt', '.env.production');
        initEnv('init/.env.production.txt', '.env.staging');
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
        initDeploy('init/deploy.sh.txt', 'deploy.production.sh', 'PRODUCTION');
        initDeploy('init/deploy.sh.txt', 'deploy.staging.sh', 'STAGING');
        function initDeploy(from, to, env) {
            FsProvider_1.FSProvider.copyAndReplaceFile(from, to, [
                { regex: /{{env}}/g, value: env },
                { regex: /{{env_lower}}/g, value: util_1.getFullTextType(env).lowerCase },
            ]);
        }
        vscode.window.showInformationMessage("Init project successfully!");
    });
}
exports.initProject = initProject;
//# sourceMappingURL=initProject.js.map