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
const codeAction_1 = require("./provider/codeAction/controller/codeAction");
const codeAction_2 = require("./provider/codeAction/service/codeAction");
const codeAction_3 = require("./provider/codeAction/entity/codeAction");
const codeAction_4 = require("./provider/codeAction/entity-request/codeAction");
const constant_1 = require("./constant");
const handleBuilder_1 = require("./provider/codeAction/entity/handleBuilder");
const handleFunction_1 = require("./provider/codeAction/entity/handleFunction");
const configuration_1 = require("./provider/treeDataProvider/module/command/configuration");
const handleMethod_1 = require("./provider/treeDataProvider/controller/command/handleMethod");
const handleConstructor_1 = require("./provider/treeDataProvider/service/command/handleConstructor");
const handleDeploy_1 = require("./provider/treeDataProvider/deploy/command/handleDeploy");
const createController_1 = require("./provider/treeDataProvider/controller/command/createController");
const createService_1 = require("./provider/treeDataProvider/service/command/createService");
const createEntity_1 = require("./provider/treeDataProvider/entity/command/createEntity");
const createEntityRequest_1 = require("./provider/treeDataProvider/entity/command/createEntityRequest");
const CompletionProvider_1 = require("./provider/completion/CompletionProvider");
const errorChecking_1 = require("./provider/errorChecking/errorChecking");
const TreeProviderCommand_1 = require("./provider/treeDataProvider/TreeProviderCommand");
const addProperty_1 = require("./provider/treeDataProvider/entity/command/addProperty");
const addRelation_1 = require("./provider/treeDataProvider/entity/command/addRelation");
const exportInterface_1 = require("./provider/treeDataProvider/entity/command/exportInterface");
const initProject_1 = require("./provider/treeDataProvider/module/command/initProject");
const contentDefine_1 = require("./provider/treeDataProvider/module/command/contentDefine");
const addPathParams_1 = require("./provider/codeAction/controller/addPathParams");
const addTokenParam_1 = require("./provider/codeAction/controller/addTokenParam");
const addValidation_1 = require("./provider/codeAction/controller/addValidation");
const TreeProviderProject_1 = require("./provider/treeDataProvider/TreeProviderProject");
const addProjectName_1 = require("./provider/treeDataProvider/project/command/addProjectName");
const getProjectDetails_1 = require("./provider/treeDataProvider/project/command/getProjectDetails");
const codeAction_5 = require("./provider/codeAction/enum/codeAction");
let stagingSB;
let productSB;
let devSB;
const serviceProvider = new codeAction_2.ServiceActionProvider();
const entityRequestProvider = new codeAction_4.EntityRequestActionProvider();
function activate({ subscriptions }) {
    // create a new status bar item that we can now manage
    devSB = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 202);
    devSB.command = constant_1.Deploy.RunDev;
    stagingSB = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 201);
    stagingSB.command = constant_1.Deploy.DeployStaging;
    productSB = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 200);
    productSB.command = constant_1.Deploy.DeployProduction;
    subscriptions.push(stagingSB, productSB);
    stagingSB.text = 'DEPLOY STAGING';
    stagingSB.show();
    productSB.text = 'DEPLOY PRODUCTION';
    productSB.show();
    devSB.text = 'RUN DEV';
    devSB.show();
    /**
     * *********************************************************
     *  						TREE DATA
     * *********************************************************
     */
    //#region 
    const bmdCommand = new TreeProviderCommand_1.TreeProviderCommand(vscode.workspace.rootPath);
    vscode.window.registerTreeDataProvider('bmdextension1', bmdCommand);
    vscode.window.registerTreeDataProvider('bmdextension2', bmdCommand);
    const bmdProject = new TreeProviderProject_1.TreeProviderProject(vscode.workspace.rootPath);
    vscode.window.registerTreeDataProvider('bmdprojects', bmdProject);
    /**
     *  TREE DATA - ENTITY
     */
    subscriptions.push(vscode.commands.registerCommand(constant_1.BMDCommand.GetProjectDetails, (projectName) => __awaiter(this, void 0, void 0, function* () { return yield getProjectDetails_1.getProjectDetails(projectName, subscriptions); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.BMDCommand.AddProjectName, () => __awaiter(this, void 0, void 0, function* () { return yield addProjectName_1.addProjectName(); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.BMDCommand.CreateEntity, (doc) => __awaiter(this, void 0, void 0, function* () {
        const fsPath = doc.fsPath;
        yield createEntity_1.createEntity(fsPath);
    })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.BMDCommand.CreateEntityRequest, (doc) => __awaiter(this, void 0, void 0, function* () {
        const fsPath = doc.fsPath;
        yield createEntityRequest_1.createEntityRequest(fsPath);
    })));
    subscriptions.push(vscode.commands.registerCommand(codeAction_4.EntityRequestAction.AddProperty, (doc) => __awaiter(this, void 0, void 0, function* () { return entityRequestProvider.addProperty(doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.AddProperty, (doc) => __awaiter(this, void 0, void 0, function* () { return addProperty_1.addProperty(doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.OneToMany, (doc) => __awaiter(this, void 0, void 0, function* () { return addRelation_1.insertEntityAction(constant_1.EntityAction.OneToMany, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.ManyToOne, (doc) => __awaiter(this, void 0, void 0, function* () { return addRelation_1.insertEntityAction(constant_1.EntityAction.ManyToOne, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.ManyToMany, (doc) => __awaiter(this, void 0, void 0, function* () { return addRelation_1.insertEntityAction(constant_1.EntityAction.ManyToMany, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.OneToOne, (doc) => __awaiter(this, void 0, void 0, function* () { return addRelation_1.insertEntityAction(constant_1.EntityAction.OneToOne, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.ExportInterface, (doc, range) => __awaiter(this, void 0, void 0, function* () { return exportInterface_1.createInterface(doc, range); })));
    /**
     *  TREE DATA - CONTROLLER
     */
    subscriptions.push(vscode.commands.registerCommand(constant_1.BMDCommand.CreateController, (doc) => __awaiter(this, void 0, void 0, function* () {
        const fsPath = doc.fsPath;
        yield createController_1.createControllerNormal(fsPath);
    })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.BMDCommand.CreateControllerResource, (doc) => __awaiter(this, void 0, void 0, function* () {
        const fsPath = doc.fsPath;
        yield createController_1.createControllerResource(fsPath);
    })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.Get, (doc) => __awaiter(this, void 0, void 0, function* () { return handleMethod_1.insertControllerFunc(constant_1.ControllerAction.Get, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.Post, (doc) => __awaiter(this, void 0, void 0, function* () { return handleMethod_1.insertControllerFunc(constant_1.ControllerAction.Post, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.GetListPagination, (doc) => __awaiter(this, void 0, void 0, function* () { return handleMethod_1.insertControllerFunc(constant_1.ControllerAction.GetListPagination, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.GetListAll, (doc) => __awaiter(this, void 0, void 0, function* () { return handleMethod_1.insertControllerFunc(constant_1.ControllerAction.GetListAll, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.CreateItem, (doc) => __awaiter(this, void 0, void 0, function* () { return handleMethod_1.insertControllerFunc(constant_1.ControllerAction.CreateItem, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.CreateItemEntityRequest, (doc) => __awaiter(this, void 0, void 0, function* () { return handleMethod_1.insertControllerFunc(constant_1.ControllerAction.CreateItemEntityRequest, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.UpdateItem, (doc) => __awaiter(this, void 0, void 0, function* () { return handleMethod_1.insertControllerFunc(constant_1.ControllerAction.UpdateItem, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.DeleteItemByRemove, (doc) => __awaiter(this, void 0, void 0, function* () { return handleMethod_1.insertControllerFunc(constant_1.ControllerAction.DeleteItemByRemove, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.DeleteItemByBlock, (doc) => __awaiter(this, void 0, void 0, function* () { return handleMethod_1.insertControllerFunc(constant_1.ControllerAction.DeleteItemByBlock, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.Upload, (doc) => __awaiter(this, void 0, void 0, function* () { return handleMethod_1.insertControllerFunc(constant_1.ControllerAction.Upload, doc); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.UploadResize, (doc) => __awaiter(this, void 0, void 0, function* () { return handleMethod_1.insertControllerFunc(constant_1.ControllerAction.UploadResize, doc); })));
    /**
     *  TREE DATA - SERVICE
     */
    subscriptions.push(vscode.commands.registerCommand(constant_1.BMDCommand.CreateService, (doc) => __awaiter(this, void 0, void 0, function* () {
        const fsPath = doc.fsPath;
        yield createService_1.createService(fsPath);
    })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ConstructorFunction.PrivateService, (doc) => __awaiter(this, void 0, void 0, function* () { return yield handleConstructor_1.insertPrivateService(constant_1.ConstructorFunction.PrivateService, doc); })));
    /**
     *  TREE DATA - MODULE
     */
    subscriptions.push(vscode.commands.registerCommand(constant_1.BMDCommand.Init, () => __awaiter(this, void 0, void 0, function* () { return yield initProject_1.initProject(); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.BMDCommand.AddModuleContentDefine, () => __awaiter(this, void 0, void 0, function* () { return yield contentDefine_1.addContentDefine(); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.BMDCommand.AddModuleConfiguration, () => __awaiter(this, void 0, void 0, function* () { return yield configuration_1.addConfiguration(); })));
    /**
     *  TREE DATA - DEPLOY
     */
    subscriptions.push(vscode.commands.registerCommand(constant_1.Deploy.DeployStaging, () => handleDeploy_1.deployStaging()));
    subscriptions.push(vscode.commands.registerCommand(constant_1.Deploy.DeployProduction, () => handleDeploy_1.deployProduct()));
    subscriptions.push(vscode.commands.registerCommand(constant_1.Deploy.RunDev, () => handleDeploy_1.runDev()));
    //#endregion
    /**
     * *********************************************************
     *  					ERROR CHECKING
     * *********************************************************
     */
    //#region 
    const collection = vscode.languages.createDiagnosticCollection('checkParamsValidator');
    if (vscode.window.activeTextEditor) {
        errorChecking_1.updateDiagnostics(vscode.window.activeTextEditor.document, collection);
    }
    subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        if (event)
            errorChecking_1.updateDiagnostics(event.document, collection);
    }));
    subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor)
            errorChecking_1.updateDiagnostics(editor.document, collection);
    }));
    //#endregion
    /**
     * *********************************************************
     *  					CODE ACTION
     * *********************************************************
     */
    //#region 
    /**
     *  CODE ACTION - CONTROLLER
     */
    subscriptions.push(vscode.languages.registerCodeActionsProvider('typescript', new codeAction_1.ControllerActionProvider(), { providedCodeActionKinds: codeAction_1.ControllerActionProvider.providedCodeActionKinds }));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.AddPathParams, (doc, range) => __awaiter(this, void 0, void 0, function* () { return addPathParams_1.handleAddPathParams(doc, range); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.AddTokenParam, (doc, range) => __awaiter(this, void 0, void 0, function* () { return addTokenParam_1.handleAddTokenParams(doc, range); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.ControllerAction.AddValidation, (doc, range) => __awaiter(this, void 0, void 0, function* () { return addValidation_1.handleAddValidation(doc, range); })));
    /**
     *  CODE ACTION - SERVICE
     */
    subscriptions.push(vscode.languages.registerCodeActionsProvider('typescript', new codeAction_2.ServiceActionProvider(), { providedCodeActionKinds: codeAction_2.ServiceActionProvider.providedCodeActionKinds }));
    subscriptions.push(vscode.commands.registerCommand(codeAction_2.ServiceAction.GetLast30, (doc) => __awaiter(this, void 0, void 0, function* () { return serviceProvider.insertServiceFunc(codeAction_2.ServiceAction.GetLast30, doc); })));
    subscriptions.push(vscode.commands.registerCommand(codeAction_2.ServiceAction.GetSum, (doc) => __awaiter(this, void 0, void 0, function* () { return yield serviceProvider.insertServiceFunc(codeAction_2.ServiceAction.GetSum, doc); })));
    subscriptions.push(vscode.commands.registerCommand(codeAction_2.ServiceAction.GetManyAndCount, (doc) => __awaiter(this, void 0, void 0, function* () { return serviceProvider.insertServiceFunc(codeAction_2.ServiceAction.GetManyAndCount, doc); })));
    /**
     *  CODE ACTION - ENTITY
     */
    subscriptions.push(vscode.languages.registerCodeActionsProvider('typescript', new codeAction_3.EntityActionProvider(), { providedCodeActionKinds: codeAction_3.EntityActionProvider.providedCodeActionKinds }));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.AddRelation, (doc, range) => __awaiter(this, void 0, void 0, function* () { return handleFunction_1.insertEntityFunction(constant_1.EntityAction.AddRelation, doc, range); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.CreateQueryBuilderPagination, (doc, range) => __awaiter(this, void 0, void 0, function* () { return handleFunction_1.insertQueryBuilder(constant_1.EntityAction.CreateQueryBuilderPagination, doc, range); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.CreateQueryBuilderFindAll, (doc, range) => __awaiter(this, void 0, void 0, function* () { return handleFunction_1.insertQueryBuilder(constant_1.EntityAction.CreateQueryBuilderFindAll, doc, range); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.CreateQueryBuilderFindOne, (doc, range) => __awaiter(this, void 0, void 0, function* () { return handleFunction_1.insertQueryBuilder(constant_1.EntityAction.CreateQueryBuilderFindOne, doc, range); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.FindOneOrThrowID, (doc, range) => __awaiter(this, void 0, void 0, function* () { return handleFunction_1.insertFindOneOrThrow(constant_1.EntityAction.FindOneOrThrowID, doc, range); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.AddPropertyToQuery, (doc, range, lastIndex, property) => __awaiter(this, void 0, void 0, function* () { return handleFunction_1.insertPropertiesToQuery(doc, range, lastIndex, property); })));
    subscriptions.push(vscode.commands.registerCommand(constant_1.EntityAction.AddBuilderRelation, (doc, range) => __awaiter(this, void 0, void 0, function* () { return handleBuilder_1.insertBuilderRelation(constant_1.EntityAction.AddBuilderRelation, doc, range); })));
    /**
     *  CODE ACTION - ENTITY REQUEST
     */
    subscriptions.push(vscode.languages.registerCodeActionsProvider('typescript', new codeAction_4.EntityRequestActionProvider(), { providedCodeActionKinds: codeAction_4.EntityRequestActionProvider.providedCodeActionKinds }));
    /**
     *  CODE ACTION - ENUM
     */
    subscriptions.push(vscode.languages.registerCodeActionsProvider('typescript', new codeAction_5.EnumActionProvider(), { providedCodeActionKinds: codeAction_5.EnumActionProvider.providedCodeActionKinds }));
    subscriptions.push(vscode.commands.registerCommand(constant_1.BMDCommand.AddEnum, (doc, range) => __awaiter(this, void 0, void 0, function* () { return codeAction_5.addEnum(doc, range); })));
    //#endregion
    /**
     * *********************************************************
     *  						COMPLETION
     * *********************************************************
     */
    subscriptions.push(CompletionProvider_1.CompletionEntityProvider, CompletionProvider_1.CompletionPropertyProvider, CompletionProvider_1.CompletionQueryProvider);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map