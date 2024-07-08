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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexBackend = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../../modules/app/app.service");
const wiring_1 = require("../../modules/remix/wiring");
let IndexBackend = class IndexBackend {
    constructor(appService) {
        this.appService = appService;
    }
    loader(args, req, name) {
        return { message: this.appService.getHello() + ', now: ' + Date.now() };
    }
    async setMessage(body) {
        return { newMessage: body.message + ' [POST, DELETE]' };
    }
};
exports.IndexBackend = IndexBackend;
__decorate([
    (0, wiring_1.Loader)(),
    __param(0, (0, wiring_1.RemixArgs)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Request, String]),
    __metadata("design:returntype", void 0)
], IndexBackend.prototype, "loader", null);
__decorate([
    (0, wiring_1.Action)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IndexBackend.prototype, "setMessage", null);
exports.IndexBackend = IndexBackend = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], IndexBackend);
//# sourceMappingURL=index.server.js.map