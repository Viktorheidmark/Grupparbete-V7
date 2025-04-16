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
const axios_1 = require("axios");
const vscode = require("vscode");
class Request {
    static get(url, params) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(url, { params: params || null });
                if ((_a = response) === null || _a === void 0 ? void 0 : _a.data) {
                    return response.data;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log('error:', (_d = (_c = (_b = error) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message);
                vscode.window.showInformationMessage(`Error: ${((_g = (_f = (_e = error) === null || _e === void 0 ? void 0 : _e.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.message) || "Lỗi rồi."}`);
            }
        });
    }
    static post(url, data) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = vscode.workspace.getConfiguration("bmdextension");
                const password = config.apiPassword;
                const response = yield axios_1.default.post(url, data, { headers: { token: password } });
                console.log('response:', response);
                if ((_a = response) === null || _a === void 0 ? void 0 : _a.data) {
                    return response.data;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log('error:', (_d = (_c = (_b = error) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message);
                vscode.window.showInformationMessage(`Error: ${((_g = (_f = (_e = error) === null || _e === void 0 ? void 0 : _e.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.message) || "Lỗi rồi."}`);
            }
        });
    }
}
exports.Request = Request;
//# sourceMappingURL=Request.js.map