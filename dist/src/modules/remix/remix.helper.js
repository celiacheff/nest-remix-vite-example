"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConstructor = void 0;
const isConstructor = (type) => {
    try {
        new type();
    }
    catch (err) {
        if (err.message.indexOf("is not a constructor") > -1) {
            return false;
        }
    }
    return true;
};
exports.isConstructor = isConstructor;
//# sourceMappingURL=remix.helper.js.map