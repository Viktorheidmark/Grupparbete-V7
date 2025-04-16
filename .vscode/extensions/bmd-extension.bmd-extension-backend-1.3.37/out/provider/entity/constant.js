"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityAction;
(function (EntityAction) {
    EntityAction["AddProperty"] = "BMD: Add property entity";
    EntityAction["OneToMany"] = "BMD: OneToMany with ";
    EntityAction["ManyToOne"] = "BMD: ManyToOne with ";
    EntityAction["ManyToMany"] = "BMD: ManyToMany with ";
    EntityAction["OneToOne"] = "BMD: OneToOne with ";
    EntityAction["ExportInterface"] = "BMD: Export interface";
    EntityAction["AddRelation"] = "BMD: Add relation";
    EntityAction["FindOneOrThrowID"] = "BMD: Find one or throw ID";
    EntityAction["CreateQueryBuilder"] = "BMD: Create query builder";
    EntityAction["AddBuilderRelation"] = "BMD: Add relation builder";
    EntityAction["AddPropertyToQuery"] = "BMD: Add properties to query string";
})(EntityAction = exports.EntityAction || (exports.EntityAction = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType["String"] = "STRING";
    PropertyType["Number"] = "NUMBER";
    PropertyType["Boolean"] = "BOOLEAN";
    PropertyType["Text"] = "TEXT";
    PropertyType["Double"] = "DOUBLE";
    PropertyType["BalanceColumn"] = "BALANCE COLUMN";
    PropertyType["IsBlockColumn"] = "IS BLOCK COLUMN";
    PropertyType["IsDeleteColumn"] = "IS DELETE COLUMN";
})(PropertyType = exports.PropertyType || (exports.PropertyType = {}));
//# sourceMappingURL=constant.js.map