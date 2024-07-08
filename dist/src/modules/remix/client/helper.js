"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = noop;
exports.deferred = deferred;
function noop() { }
function deferred() {
    let resolve = noop;
    let reject = noop;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return {
        promise,
        resolve,
        reject,
    };
}
//# sourceMappingURL=helper.js.map