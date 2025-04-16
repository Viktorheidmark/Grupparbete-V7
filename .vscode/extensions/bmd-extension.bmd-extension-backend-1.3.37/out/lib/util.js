"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function replaceSymbolTemplate(content) {
    content = content.replace(/{{backtick}}/g, '`');
    content = content.replace(/{{dollar}}/g, '$');
    return content;
}
exports.replaceSymbolTemplate = replaceSymbolTemplate;
function toLowerCaseFirstLetter(name) {
    return name.charAt(0).toLowerCase() + name.slice(1);
}
exports.toLowerCaseFirstLetter = toLowerCaseFirstLetter;
function toUpperCaseFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
exports.toUpperCaseFirstLetter = toUpperCaseFirstLetter;
function getFullTextType(text) {
    return {
        lowerCase: text.toLowerCase(),
        upperCase: text.toUpperCase(),
        camelCase: exports.toCamelCase(text),
        kebabCase: exports.toKebabCase(text),
        titleCase: exports.toTitleCase(text),
        snakeCase: exports.toSnakeCase(text),
        snakeUpperCase: exports.toSnakeUpperCase(text),
        classifyCase: exports.capitalize(text)
    };
}
exports.getFullTextType = getFullTextType;
exports.words = (str, pattern = /[^a-zA-Z-]+/) => str.split(pattern).filter(Boolean);
exports.toCamelCase = (str) => {
    let s = str &&
        str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map((x) => {
            return x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase();
        })
            .join('');
    return s.slice(0, 1).toLowerCase() + s.slice(1);
};
exports.toKebabCase = (str) => str &&
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.toLowerCase())
        .join('-');
exports.toTitleCase = (str) => str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(' ');
exports.capitalize = ([first, ...rest], lowerRest = false) => {
    return first.toUpperCase() + (lowerRest ? rest.join('').toLowerCase() : rest.join(''));
};
exports.toSnakeCase = (str) => {
    return str &&
        str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map((x) => x.toLowerCase())
            .join('_');
};
exports.toSnakeUpperCase = (str) => {
    return str &&
        str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map((x) => x.toUpperCase())
            .join('_');
};
function getLastFolderFromPath(path) {
    if (!path)
        return '';
    const folders = path.split('/');
    return folders[folders.length - 1];
}
exports.getLastFolderFromPath = getLastFolderFromPath;
function getWordBetweenSpace(line, indexSelected) {
    let text = '';
    let lastIndex = indexSelected - 1;
    for (let index = indexSelected - 1; index > 0; index--) {
        const char = line[index];
        if (char != " " && char != "`") {
            text = char + text;
        }
        else {
            break;
        }
    }
    for (let index = indexSelected; index < line.length; index++) {
        const char = line[index];
        if (char != " " && char != "." && char != "`") {
            text += char;
            lastIndex = index;
        }
        else {
            break;
        }
    }
    return { text, lastIndex };
}
exports.getWordBetweenSpace = getWordBetweenSpace;
//# sourceMappingURL=util.js.map