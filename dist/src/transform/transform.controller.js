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
exports.TransformController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const firefly_service_1 = require("./firefly.service");
let TransformController = class TransformController {
    constructor(fireflyService) {
        this.fireflyService = fireflyService;
    }
    async getToken() {
        console.log('coming');
        this.fireflyService.getAccessToken();
        const token = await this.fireflyService.getAccessToken();
        console.log('token', token);
    }
    async transformImage(file) {
        const result = await (await this.fireflyService.sendToFirefly(file.path)).toPromise();
        return result.data;
    }
};
__decorate([
    (0, common_1.Get)('/token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransformController.prototype, "getToken", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransformController.prototype, "transformImage", null);
TransformController = __decorate([
    (0, common_1.Controller)('transform'),
    __metadata("design:paramtypes", [firefly_service_1.FireflyService])
], TransformController);
exports.TransformController = TransformController;
//# sourceMappingURL=transform.controller.js.map