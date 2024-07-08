"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRemixConfigProvider = exports.REMIX_CONFIG = void 0;
const path = require("path");
exports.REMIX_CONFIG = "REMIX_CONFIG";
const buildRemixConfigProvider = (config) => {
    return {
        provide: exports.REMIX_CONFIG,
        useValue: {
            publicDir: config?.publicDir || path.join(__dirname, "public"),
            browserBuildDir: config?.browserBuildDir || path.join(process.cwd(), "./dist/client"),
            remixServerDir: config?.remixServerDir ?? path.join(process.cwd(), "./dist/routes/server"),
            useCustomController: config?.useCustomController ?? "RemixController",
            isStaticAsset: config?.isStaticAsset,
        },
    };
};
exports.buildRemixConfigProvider = buildRemixConfigProvider;
//# sourceMappingURL=remix.config.js.map