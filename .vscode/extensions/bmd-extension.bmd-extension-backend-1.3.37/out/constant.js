"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ControllerAction;
(function (ControllerAction) {
    ControllerAction["Get"] = "bmdextension.get";
    ControllerAction["Post"] = "bmdextension.post";
    ControllerAction["GetListPagination"] = "bmdextension.getListPagination";
    ControllerAction["GetListAll"] = "bmdextension.getListAll";
    ControllerAction["CreateItem"] = "bmdextension.createItem";
    ControllerAction["UpdateItem"] = "bmdextension.updateItem";
    ControllerAction["CreateItemEntityRequest"] = "bmdextension.createItemEntityRequest";
    ControllerAction["DeleteItemByRemove"] = "bmdextension.deleteItemByRemove";
    ControllerAction["DeleteItemByBlock"] = "bmdextension.deleteItemByBlock";
    ControllerAction["Upload"] = "bmdextension.upload";
    ControllerAction["UploadResize"] = "bmdextension.uploadResize";
    ControllerAction["AddPathParams"] = "BMD: Add @PathParams";
    ControllerAction["AddTokenParam"] = "BMD: Add token param";
    ControllerAction["AddValidation"] = "BMD: Add validate";
})(ControllerAction = exports.ControllerAction || (exports.ControllerAction = {}));
var EntityAction;
(function (EntityAction) {
    EntityAction["AddProperty"] = "bmdextension.addProperty";
    EntityAction["OneToMany"] = "bmdextension.oneToMany";
    EntityAction["ManyToOne"] = "bmdextension.manyToOne";
    EntityAction["ManyToMany"] = "bmdextension.manyToMany";
    EntityAction["OneToOne"] = "bmdextension.oneToOne";
    EntityAction["OpenAndScrollToRelation"] = "BMD: Open and scroll to Relations";
    EntityAction["ExportInterface"] = "bmdextension.exportInterface";
    EntityAction["AddRelation"] = "BMD: Add relation";
    EntityAction["FindOneOrThrowID"] = "BMD: Find one or throw ID";
    EntityAction["CreateQueryBuilderPagination"] = "BMD: Create query builder pagination";
    EntityAction["CreateQueryBuilderFindAll"] = "BMD: Create query builder find all";
    EntityAction["CreateQueryBuilderFindOne"] = "BMD: Create query builder find one";
    EntityAction["AddBuilderRelation"] = "BMD: Add relation builder";
    EntityAction["AddPropertyToQuery"] = "BMD: Add properties to query string";
})(EntityAction = exports.EntityAction || (exports.EntityAction = {}));
var BMDCommand;
(function (BMDCommand) {
    BMDCommand["Init"] = "bmdextension.init";
    BMDCommand["CreateControllerResource"] = "bmdextension.createControllerResource";
    BMDCommand["CreateController"] = "bmdextension.createController";
    BMDCommand["CreateService"] = "bmdextension.createService";
    BMDCommand["CreateEntity"] = "bmdextension.createEntity";
    BMDCommand["CreateEntityRequest"] = "bmdextension.createEntityRequest";
    BMDCommand["AddModuleContentDefine"] = "bmdextension.contentDefine";
    BMDCommand["AddModuleConfiguration"] = "bmdextension.configuration";
    BMDCommand["AddProjectName"] = "bmdextension.addProject";
    BMDCommand["AddEnum"] = "BMD: Add enum";
    BMDCommand["GetProjectDetails"] = "bmdextension.getProjectDetails";
})(BMDCommand = exports.BMDCommand || (exports.BMDCommand = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType["String"] = "STRING";
    PropertyType["Number"] = "NUMBER";
    PropertyType["Boolean"] = "BOOLEAN";
    PropertyType["Text"] = "TEXT";
    PropertyType["Double"] = "DOUBLE";
    PropertyType["BalanceColumn"] = "BALANCE COLUMN";
    PropertyType["IsBlockColumn"] = "IS BLOCK COLUMN";
    PropertyType["TypeColumn"] = "TYPE COLUMN";
    PropertyType["StatusColumn"] = "STATUS COLUMN";
    PropertyType["IsDeleteColumn"] = "IS DELETE COLUMN";
})(PropertyType = exports.PropertyType || (exports.PropertyType = {}));
var Deploy;
(function (Deploy) {
    Deploy["DeployStaging"] = "bmdextension.deployStaging";
    Deploy["DeployProduction"] = "bmdextension.deployProduct";
    Deploy["RunDev"] = "bmdextension.runDev";
})(Deploy = exports.Deploy || (exports.Deploy = {}));
var Confirmation;
(function (Confirmation) {
    Confirmation["Yes"] = "YES";
    Confirmation["No"] = "NO";
})(Confirmation = exports.Confirmation || (exports.Confirmation = {}));
var TypeRequest;
(function (TypeRequest) {
    TypeRequest["Insert"] = "Insert";
    TypeRequest["Update"] = "Update";
})(TypeRequest = exports.TypeRequest || (exports.TypeRequest = {}));
var ConstructorFunction;
(function (ConstructorFunction) {
    ConstructorFunction["PrivateService"] = "bmdextension.insertPrivateService";
})(ConstructorFunction = exports.ConstructorFunction || (exports.ConstructorFunction = {}));
exports.OTHER = 'OTHER';
//# sourceMappingURL=constant.js.map