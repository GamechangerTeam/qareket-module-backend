"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const addAccessToken_1 = __importDefault(require("./addAccessToken"));
const token = 'mock_token';
const merge = got_1.default.mergeOptions;
describe('Client `addAccessToken` hook', () => {
    it('should add access token to URL without a query', () => {
        const options = merge({ path: 'test', responseType: 'json' });
        (0, addAccessToken_1.default)(token)(options);
        expect(options.path).toBe(`test?access_token=${token}`);
    });
    it('should add access token to URL with a query', () => {
        const options = merge({ path: 'test?value=1', responseType: 'json' });
        (0, addAccessToken_1.default)(token)(options);
        expect(options.path).toBe(`test?value=1&access_token=${token}`);
    });
    it('should not add access token when it is undefined', () => {
        const options = merge({ path: 'test', responseType: 'json' });
        (0, addAccessToken_1.default)()(options);
        expect(options.path).toBe('test');
    });
    it('should not add access token when URL is undefined', () => {
        const options = merge({ path: undefined, responseType: 'json' });
        (0, addAccessToken_1.default)(token)(options);
        expect(options.path).toBe(undefined);
    });
});
