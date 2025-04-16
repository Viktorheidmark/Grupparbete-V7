"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const handleProperty_1 = require("./handleProperty");
const handleBuilder_1 = require("./handleBuilder");
const handleFunction_1 = require("./handleFunction");
class EntityActionProvider {
    provideCodeActions(document, range) {
        // Add properties to entity file
        const addPropertiesAction = handleProperty_1.createPropertyAction(document, range);
        if (addPropertiesAction && addPropertiesAction.length)
            return addPropertiesAction;
        // // Add relation to entity file
        // const addRelationAction = createRelationAction(document, range)
        // if (addRelationAction && addRelationAction.length)
        //     return addRelationAction
        // Add relation to entity function like: find, findOne
        const addFunctionAction = handleFunction_1.createAddFunctionAction(document, range);
        if (addFunctionAction && addFunctionAction.length)
            return addFunctionAction;
        // Add relation to query builder
        const addBuilderRelationAction = handleBuilder_1.createBuilderAction(document, range);
        if (addBuilderRelationAction && addBuilderRelationAction.length)
            return addBuilderRelationAction;
        // Add relation to entity function like: find, findOne
        const addRelationFunctionAction = handleFunction_1.createAddRelationFunctionAction(document, range);
        if (addRelationFunctionAction && addRelationFunctionAction.length)
            return addRelationFunctionAction;
        return [];
    }
}
exports.EntityActionProvider = EntityActionProvider;
EntityActionProvider.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=EntityProvider.js.map