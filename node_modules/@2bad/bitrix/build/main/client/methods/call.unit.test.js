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
const got_1 = __importDefault(require("got"));
const nock_1 = __importDefault(require("nock"));
const methods_1 = require("../../methods");
const call_1 = __importStar(require("./call"));
const TEST_URI = 'https://test.com/rest';
const call = (0, call_1.default)({
    get: got_1.default.extend({ prefixUrl: TEST_URI, responseType: 'json' }).get
});
const RESPONSE_200 = 200;
describe('Client `handlePayload` method', () => {
    it('should return `GetPayload`', () => {
        const payload = {
            result: 'done',
            time: { start: 1, finish: 1, duration: 1, processing: 1, date_start: 'date', date_finish: 'date' }
        };
        expect((0, call_1.handlePayload)(payload)).toBe(payload);
    });
    it('should return `ListPayload`', () => {
        const payload = {
            error: undefined,
            next: undefined,
            result: ['done'],
            time: { start: 1, finish: 1, duration: 1, processing: 1, date_start: 'date', date_finish: 'date' },
            total: 1
        };
        expect((0, call_1.handlePayload)(payload)).toBe(payload);
    });
    it('should throw when getting error in `ListPayload`', () => {
        const payload = {
            error: 'Expected error for `handlePayload`',
            next: undefined,
            result: ['done'],
            time: { start: 1, finish: 1, duration: 1, processing: 1, date_start: 'date', date_finish: 'date' },
            total: 1
        };
        expect(() => (0, call_1.handlePayload)(payload)).toThrowErrorMatchingSnapshot();
    });
    it('should return `BatchPayload` with numbered commands', () => {
        const payload = {
            result: {
                result: { one: 'done' },
                result_error: [],
                result_next: [],
                result_time: [],
                result_total: []
            },
            time: { start: 1, finish: 1, duration: 1, processing: 1, date_start: 'date', date_finish: 'date' }
        };
        expect((0, call_1.handlePayload)(payload)).toBe(payload);
    });
    it('should return `BatchPayload` with result from array of commands', () => {
        const payload = {
            result: {
                result: ['done'],
                result_error: [],
                result_next: [],
                result_time: [],
                result_total: []
            },
            time: { start: 1, finish: 1, duration: 1, processing: 1, date_start: 'date', date_finish: 'date' }
        };
        expect((0, call_1.handlePayload)(payload)).toBe(payload);
    });
    it('should throw when getting errors in `BatchPayload` with result from named commands', () => {
        const payload = {
            result: {
                result: { one: 'done' },
                result_error: { one: 'Expected error for `handlePayload`' },
                result_next: [],
                result_time: [],
                result_total: []
            },
            time: { start: 1, finish: 1, duration: 1, processing: 1, date_start: 'date', date_finish: 'date' }
        };
        expect(() => (0, call_1.handlePayload)(payload)).toThrowErrorMatchingSnapshot();
    });
    it('should throw when getting errors in `BatchPayload` with result from array of commands', () => {
        const payload = {
            result: {
                result: ['done'],
                result_error: ['Expected error for `handlePayload`'],
                result_next: [],
                result_time: [],
                result_total: []
            },
            time: { start: 1, finish: 1, duration: 1, processing: 1, date_start: 'date', date_finish: 'date' }
        };
        expect(() => (0, call_1.handlePayload)(payload)).toThrowErrorMatchingSnapshot();
    });
});
describe('Client `call` method', () => {
    it('should form a proper request', async () => {
        const params = { id: '1' };
        const scope = (0, nock_1.default)(TEST_URI)
            .get(`/${methods_1.Method.CRM_DEAL_GET}`)
            .query(params)
            .reply(RESPONSE_200);
        await call(methods_1.Method.CRM_DEAL_GET, params);
        expect(scope.done()).toBe(undefined);
    });
    it('should form a proper request with list methods', async () => {
        const params = {
            filter: { '>PROBABILITY': 50 },
            order: { STAGE_ID: 'ASC' },
            select: ['ID', 'TITLE'],
            start: 50
        };
        const scope = (0, nock_1.default)(TEST_URI)
            .get(`/${methods_1.Method.CRM_DEAL_LIST}`)
            .query(params)
            .reply(RESPONSE_200);
        await call(methods_1.Method.CRM_DEAL_LIST, params);
        expect(scope.done()).toBe(undefined);
    });
    it('should return body as payload', async () => {
        const params = { id: '1' };
        const payload = { test: 'value' };
        (0, nock_1.default)(TEST_URI)
            .get(`/${methods_1.Method.CRM_DEAL_GET}`)
            .query(params)
            .reply(RESPONSE_200, payload);
        expect(await call(methods_1.Method.CRM_DEAL_GET, params)).toEqual(payload);
    });
    it('should return body as payload with list methods', async () => {
        const payload = { result: ['done'] };
        (0, nock_1.default)(TEST_URI)
            .get(`/${methods_1.Method.CRM_DEAL_LIST}`)
            .reply(RESPONSE_200, payload);
        expect(await call(methods_1.Method.CRM_DEAL_LIST, {})).toEqual(payload);
    });
    it('should throw when getting errors in payload', () => {
        const payload = { result: ['done'], error: 'Expected error for `getList`' };
        (0, nock_1.default)(TEST_URI)
            .get(`/${methods_1.Method.CRM_DEAL_LIST}`)
            .reply(RESPONSE_200, payload);
        return expect(call(methods_1.Method.CRM_DEAL_LIST, {})).rejects.toMatchSnapshot();
    });
    it('should throw when getting errors in batch payload', () => {
        const payload = {
            result: {
                result: ['done'],
                result_error: ['Expected error'],
                result_next: [],
                result_time: [],
                result_total: []
            },
            time: { start: 1, finish: 1, duration: 1, processing: 1, date_start: 'date', date_finish: 'date' }
        };
        (0, nock_1.default)(TEST_URI)
            .get(`/${methods_1.Method.BATCH}`)
            .reply(RESPONSE_200, payload);
        return expect(call(methods_1.Method.BATCH, {})).rejects.toMatchSnapshot();
    });
    it.todo('should cast payload to the <P>');
});
