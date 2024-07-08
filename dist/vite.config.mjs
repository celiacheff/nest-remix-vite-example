"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dev_1 = require("@remix-run/dev");
const node_1 = require("@remix-run/node");
const vite_1 = require("vite");
const vite_tsconfig_paths_1 = require("vite-tsconfig-paths");
(0, node_1.installGlobals)();
exports.default = (0, vite_1.defineConfig)({
    plugins: [
        (0, dev_1.vitePlugin)({
            appDirectory: 'src',
        }),
        (0, vite_tsconfig_paths_1.default)(),
    ],
});
//# sourceMappingURL=vite.config.mjs.map