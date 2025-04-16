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
    const symbolBreakWork = [' ', '`', "'", '.', '(', ')'];
    let isBreakByDot = false;
    let text = '';
    let lastIndex = indexSelected - 1;
    for (let index = indexSelected - 1; index > 0; index--) {
        const char = line[index];
        if (!symbolBreakWork.includes(char)) {
            text = char + text;
        }
        else {
            if (char == '.')
                isBreakByDot = true;
            break;
        }
    }
    for (let index = indexSelected; index < line.length; index++) {
        const char = line[index];
        if (!symbolBreakWork.includes(char)) {
            text += char;
            lastIndex = index;
        }
        else {
            break;
        }
    }
    return { text, lastIndex, isBreakByDot };
}
exports.getWordBetweenSpace = getWordBetweenSpace;
function removePlural(name) {
    name = name.replace(/ies$/, 'y');
    name = name.replace(/ses$/, 's');
    name = name.replace(/s$/, '');
    return name;
}
exports.removePlural = removePlural;
function getMatch(regex, str) {
    let m;
    const matches = [];
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            matches.push(match);
        });
    }
    return matches;
}
exports.getMatch = getMatch;
//# sourceMappingURL=util.js.map