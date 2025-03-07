"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bitrix_1 = __importDefault(require("./bitrix"));
const client = __importStar(require("./client"));
describe('Bitrix', () => {
    it('should init', () => {
        expect(() => (0, bitrix_1.default)('https://test.com', 'test_token')).not.toThrow();
    });
    it('should pass endpoint and access token to the client', () => {
        const SpiedClient = jest.spyOn(client, 'default');
        (0, bitrix_1.default)('https://test.com', 'test_token');
        expect(SpiedClient.mock.calls).toMatchSnapshot();
    });
    it('should expose API methods', () => {
        const bitrix = (0, bitrix_1.default)('https://test.com', 'test_token');
        expect(bitrix).toMatchSnapshot();
    });
});
