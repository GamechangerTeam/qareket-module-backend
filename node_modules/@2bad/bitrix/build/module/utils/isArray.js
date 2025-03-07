// Because `Array.isArray` itself give a strange result with `any[]`
export default (x) => Array.isArray(x);
