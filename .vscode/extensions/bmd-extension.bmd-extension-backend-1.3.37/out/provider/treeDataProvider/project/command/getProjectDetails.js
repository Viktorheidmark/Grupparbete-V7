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
const API_1 = require("../../../../API");
const Request_1 = require("../../../../Request");
const clipboard = require("clipboardy");
let INTERFACES = [];
let ENUMS = [];
let FILTER_INTERFACE = '';
let FILTER_ENUM = '';
let PROJECT_NAME = '';
var WebViewCommand;
(function (WebViewCommand) {
    WebViewCommand["Refresh"] = "REFRESH";
    WebViewCommand["CopyInterface"] = "COPY-INTERFACE";
    WebViewCommand["CopyEnum"] = "COPY-ENUM";
    WebViewCommand["FilterInterfaces"] = "FILTER_INTERFACES";
    WebViewCommand["FilterEnums"] = "FILTER_ENUMS";
    WebViewCommand["UpdateInterfacesPart"] = "UPDATE_INTERFACES_PART";
    WebViewCommand["UpdateEnumsPart"] = "UPDATE_ENUMS_PART";
})(WebViewCommand || (WebViewCommand = {}));
function fetchInterfaces({ projectName, search }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield Request_1.Request.get(API_1.API.Interface.get, { project: projectName, search: FILTER_INTERFACE });
        if (response)
            INTERFACES = response.data.interfaces;
    });
}
function fetchEnums({ projectName, search }) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield Request_1.Request.get(API_1.API.Enum.get, { project: projectName, search: FILTER_ENUM });
        if (response)
            ENUMS = response.data.enums;
    });
}
function getProjectDetails(projectName, subscriptions) {
    return __awaiter(this, void 0, void 0, function* () {
        PROJECT_NAME = projectName;
        const projectPanel = `PROJECT: ${projectName.toUpperCase()}`;
        const panel = vscode.window.createWebviewPanel('BMD', 'BMD', vscode.ViewColumn.Two, { enableScripts: true });
        panel.webview.html = yield getWebviewContent({ projectPanel });
        // And set its HTML content
        panel.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
            console.log('message:', JSON.stringify(message));
            if (message.command == WebViewCommand.CopyInterface) {
                const text = INTERFACES[message.index].body;
                yield clipboard.write(text);
                return vscode.window.showInformationMessage('Copied!');
            }
            if (message.command == WebViewCommand.CopyEnum) {
                const text = ENUMS[message.index].body;
                yield clipboard.write(text);
                return vscode.window.showInformationMessage('Copied!');
            }
            if (message.command == WebViewCommand.FilterInterfaces) {
                FILTER_INTERFACE = message.text;
                panel.webview.postMessage({
                    command: WebViewCommand.UpdateInterfacesPart,
                    text: yield getStringInterfaces()
                });
            }
            if (message.command == WebViewCommand.FilterEnums) {
                FILTER_ENUM = message.text;
                panel.webview.postMessage({
                    command: WebViewCommand.UpdateEnumsPart,
                    text: yield getStringEnums()
                });
            }
            if (message.command == WebViewCommand.Refresh) {
                panel.webview.postMessage({
                    command: WebViewCommand.UpdateEnumsPart,
                    text: yield getStringEnums()
                });
                panel.webview.postMessage({
                    command: WebViewCommand.UpdateInterfacesPart,
                    text: yield getStringInterfaces()
                });
            }
        }), undefined, subscriptions);
    });
}
exports.getProjectDetails = getProjectDetails;
function getInterfacesPart({ name, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return `
    <div class="col-sm-6 text-center">
        <h4>${name.toUpperCase()}</h4>
        <div class="form-group">
            <input 
            style="background-color: transparent; color: white;" 
            class="form-control" 
            id="search-interface"
            placeholder="Search"
            onkeyup="filterInterfaces()"
            value="${FILTER_INTERFACE}"
            >
        </div>
        <div class="container text-left" id="interfaces">
            ${yield getStringInterfaces()}
        </div>
    </div>
    `;
    });
}
function getStringInterfaces() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetchInterfaces({ projectName: PROJECT_NAME });
        function getInterfaceItem(item, index) {
            return `
        <div class="row" onClick="copyInterface(${index})">
            <pre style="color: #f1f1f1; margin-bottom: -2rem" id="interface-${item.id}">
                ${item.body}
            </pre>
        </div>
        `;
        }
        let string = ``;
        if (INTERFACES.length) {
            string = INTERFACES.map((item, index) => getInterfaceItem(item, index)).join(`\n`);
        }
        return string;
    });
}
function getEnumsPart({ name }) {
    return __awaiter(this, void 0, void 0, function* () {
        return `
    <div class="col-sm-6 text-center">
        <h4>${name.toUpperCase()}</h4>
        <div class="form-group">
            <input 
            style="background-color: transparent; color: white;" 
            class="form-control"
            placeholder="Search"
            id="search-enum"
            onkeyup="filterEnums()"
            value="${FILTER_ENUM}"
            >
        </div>
        <div class="container text-left" id="enums">
            ${yield getStringEnums()}
        </div>
    </div>
    `;
    });
}
function getStringEnums() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetchEnums({ projectName: PROJECT_NAME });
        function getEnumItem(item, index) {
            return `
        <div class="row" onClick="copyEnum(${index})">
            <pre style="color: #f1f1f1; margin-bottom: -2rem" id="enum-${item.id}">
                ${item.body}
            </pre>
        </div>
        `;
        }
        let string = ``;
        if (ENUMS.length) {
            string = ENUMS.map((item, index) => getEnumItem(item, index)).join(`\n`);
        }
        return string;
    });
}
function getWebviewContent({ projectPanel }) {
    return __awaiter(this, void 0, void 0, function* () {
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BMD PROJECT</title>
        <style>
            * {
                box-sizing: border-box;
            }
            
        </style>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    </head>
    <body style="background-color: transparent; color: #f1f1f1">
    
    <div class="container-fluid">
            <h3 class="text-center">${projectPanel}
                <button onclick="refresh()" type="button" class="btn btn-info">RELOAD</button>
            </h3>
            
            <div class="row">
                ${yield getEnumsPart({ name: 'enum' })}
                ${yield getInterfacesPart({ name: 'interface' })}
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();

            function refresh() {
                vscode.postMessage({
                    command: '${WebViewCommand.Refresh}',
                })
            }

            function copyInterface(index) {
                vscode.postMessage({
                    command: '${WebViewCommand.CopyInterface}',
                    index
                })
            }

            function copyEnum(index) {
                vscode.postMessage({
                    command: '${WebViewCommand.CopyEnum}',
                    index
                })
            }

            function filterInterfaces() {
                const edValue = document.getElementById("search-interface");
                const text = edValue.value;
                vscode.postMessage({
                    command: '${WebViewCommand.FilterInterfaces}',
                    text
                })
            }

            function filterEnums() {
                const edValue = document.getElementById("search-enum");
                const text = edValue.value;
                vscode.postMessage({
                    command: '${WebViewCommand.FilterEnums}',
                    text
                })
            }

            window.addEventListener('message', event => {

                const message = event.data; 
    
                if (message.command == '${WebViewCommand.UpdateInterfacesPart}') {
                    document.getElementById("interfaces").innerHTML = message.text
                }

                if (message.command == '${WebViewCommand.UpdateEnumsPart}') {
                    document.getElementById("enums").innerHTML = message.text
                }
            });

        </script>
    </body>
    </html>`;
    });
}
//# sourceMappingURL=getProjectDetails.js.map