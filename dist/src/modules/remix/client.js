"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActionData = exports.useLoaderData = exports.usePromiseSubmit = void 0;
const react_1 = require("@remix-run/react");
var usePromiseSubmit_1 = require("./client/usePromiseSubmit");
Object.defineProperty(exports, "usePromiseSubmit", { enumerable: true, get: function () { return usePromiseSubmit_1.usePromiseSubmit; } });
const useLoaderData = (...args) => react_1.useLoaderData.apply(null, args);
exports.useLoaderData = useLoaderData;
const useActionData = (...args) => react_1.useActionData.apply(null, args);
exports.useActionData = useActionData;
//# sourceMappingURL=client.js.map