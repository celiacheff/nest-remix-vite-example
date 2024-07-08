"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RemixModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemixModule = void 0;
const common_1 = require("@nestjs/common");
const remix_controller_1 = require("./remix.controller");
const serve_static_1 = require("@nestjs/serve-static");
const node_path_1 = require("node:path");
const wiring_1 = require("./wiring");
const app_service_1 = require("../app/app.service");
const remix_config_1 = require("./remix.config");
let RemixModule = RemixModule_1 = class RemixModule {
    constructor() {
    }
    static async forRoot(metadata) {
        let build = null;
        if (process.env.NODE_ENV !== 'production') {
            const vite = await Promise.resolve().then(() => require('vite'));
            RemixModule_1.viteDevServer = await vite.createServer({ server: { middlewareMode: true } });
            build = () => RemixModule_1.viteDevServer.ssrLoadModule('virtual:remix/server-build');
        }
        else {
            build = await Promise.resolve().then(() => require('./build/server/index.js'));
        }
        return {
            module: RemixModule_1,
            imports: [
                serve_static_1.ServeStaticModule.forRoot({ rootPath: metadata?.publicDir || (0, node_path_1.join)(__dirname, 'build', 'client') }),
            ],
            providers: [
                ...(0, wiring_1.getLoaderProviders)(),
                (0, remix_config_1.buildRemixConfigProvider)(metadata),
                {
                    provide: 'REMIX_BUILD',
                    useValue: build,
                },
            ],
        };
    }
    configure(consumer) {
        if (RemixModule_1.viteDevServer) {
            consumer.apply(RemixModule_1.viteDevServer.middlewares).forRoutes({
                path: '*',
                method: common_1.RequestMethod.ALL,
            });
        }
    }
};
exports.RemixModule = RemixModule;
RemixModule.viteDevServer = null;
exports.RemixModule = RemixModule = RemixModule_1 = __decorate([
    (0, common_1.Module)({
        controllers: [remix_controller_1.RemixController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [])
], RemixModule);
//# sourceMappingURL=remix.module.js.map