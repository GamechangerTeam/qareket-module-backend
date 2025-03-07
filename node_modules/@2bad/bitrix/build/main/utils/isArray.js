"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Because `Array.isArray` itself give a strange result with `any[]`
exports.default = (x) => Array.isArray(x);
