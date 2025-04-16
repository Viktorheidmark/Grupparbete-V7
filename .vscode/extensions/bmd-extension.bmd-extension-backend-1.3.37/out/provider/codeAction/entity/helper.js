"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FsProvider_1 = require("../../../FsProvider");
const util_1 = require("../../../util");
function getEntityFromFunction(document, range, isQuery = false) {
    const start = range.start;
    const line = document.lineAt(start.line);
    if (!isQuery) {
        const entities = line.text.match(/\s[A-Z][A-z]+/);
        if (entities && entities.length) {
            const entity = entities[0].replace(' ', '').replace('.', '');
            return { text: entity, lastIndex: 0 };
        }
        return { text: "", lastIndex: 0 };
    }
    else {
        const { text, lastIndex } = util_1.getWordBetweenSpace(line.text, range.start.character);
        if (!text)
            return { text: "", lastIndex: 0 };
        const entityFullText = util_1.getFullTextType(text);
        return { text: entityFullText.classifyCase, lastIndex };
    }
}
exports.getEntityFromFunction = getEntityFromFunction;
function getPropertiesEntity(name) {
    const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(`src/entity/${name}.ts`);
    if (!lines.length)
        return [];
    const properties = [];
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        if (line.includes('@Column') || line.includes('@PrimaryGeneratedColumn')) {
            let lineProperty = lines[index + 1];
            if (lineProperty.includes('JsonProperty') || lineProperty.includes('Property')) {
                lineProperty = lines[index + 2];
            }
            lineProperty = lineProperty.replace(':', '').replace(';', '');
            const words = lineProperty.split(' ').filter(Boolean);
            if (words.length > 1) {
                properties.push({ name: words[0], type: words[1] });
            }
            else
                continue;
        }
    }
    const propertyInCore = getPropertyInCore();
    properties.push(...propertyInCore);
    return properties;
}
exports.getPropertiesEntity = getPropertiesEntity;
function getPropertyInCore() {
    const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(`src/core/entity/CoreEntity.ts`);
    if (!lines.length)
        return [];
    const properties = [];
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        if (line.includes('@Column') || line.includes('@PrimaryGeneratedColumn')) {
            let lineProperty = lines[index + 1];
            if (lineProperty.includes('JsonProperty') || lineProperty.includes('Property')) {
                lineProperty = lines[index + 2];
            }
            lineProperty = lineProperty.replace(':', '').replace(';', '');
            const words = lineProperty.split(' ').filter(Boolean);
            if (words.length > 1) {
                properties.push({ name: words[0], type: words[1] });
            }
            else
                continue;
        }
    }
    return properties;
}
function getRelationsEntityDeeper(name, nameExcept = '') {
    const lines = FsProvider_1.FSProvider.getLinesDocumentInFile(`src/entity/${name}.ts`);
    if (!lines.length)
        return { relations: [], entities: [] };
    const relations = [];
    const nextEntity = [];
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        if (line.includes('@ManyToMany') ||
            line.includes('@OneToMany') ||
            line.includes('@ManyToOne') ||
            line.includes('@OneToOne')) {
            let lineProperty = lines[index + 1];
            if (lineProperty.includes('@')) {
                lineProperty = lines[index + 2];
            }
            if (lineProperty.includes('@')) {
                lineProperty = lines[index + 3];
            }
            lineProperty = lineProperty.replace(':', '').replace(';', '').replace('[]', '');
            if (nameExcept && lineProperty == nameExcept)
                continue;
            const words = lineProperty.split(' ').filter(Boolean);
            if (words.length > 1) {
                relations.push(words[0]);
                nextEntity.push(words[1]);
            }
        }
    }
    return { relations, entities: nextEntity };
}
exports.getRelationsEntityDeeper = getRelationsEntityDeeper;
function getRelationsEntity(name) {
    const finalRelation = [];
    const { relations, entities } = getRelationsEntityDeeper(name);
    if (!relations || !relations.length)
        return [];
    relations.map((r, i) => {
        finalRelation.push(r);
        const nextRelations = getRelationsEntityDeeper(entities[i], name);
        if (relations && relations.length) {
            finalRelation.push(...nextRelations.relations.map((n) => `${r}.${n}`));
        }
    });
    return finalRelation;
}
exports.getRelationsEntity = getRelationsEntity;
function findLastLineRelation(document, currentLine) {
    let start = true;
    let currentLineNumber = currentLine.lineNumber;
    while (start) {
        currentLineNumber += 1;
        let newLine = document.lineAt(currentLineNumber);
        if (!newLine.text.includes('Join')) {
            start = false;
        }
    }
    return currentLineNumber;
}
exports.findLastLineRelation = findLastLineRelation;
//# sourceMappingURL=helper.js.map