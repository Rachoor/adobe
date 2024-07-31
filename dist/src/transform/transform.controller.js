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
const transform_service_1 = require("./transform.service");
const platform_express_1 = require("@nestjs/platform-express");
const firefly_service_1 = require("./firefly.service");
const multer_1 = require("multer");
const path_1 = require("path");
const env = require("../../environment");
const axios_1 = require("axios");
const storage = (0, multer_1.diskStorage)({
    destination: './uploads',
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = (0, path_1.extname)(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
    }
});
let TransformController = class TransformController {
    constructor(fireflyService, transformService) {
        this.fireflyService = fireflyService;
        this.transformService = transformService;
    }
    async getToken() {
        console.log('coming');
        this.fireflyService.getAccessToken();
        const token = await this.fireflyService.getAccessToken();
        console.log('token', token);
    }
    handleImageUPload(file) {
        const response = this.transformService.transformanImage(file, { title: 'test title', description: 'test description' });
        return {
            message: 'File uploaded successfully',
            file: response,
        };
    }
    async generateImages() {
        var _a;
        const accessToken = await this.fireflyService.getAccessToken();
        let body = {
            "numVariations": 2,
            "seeds": [
                0, 4999
            ],
            "size": {
                "width": 2048,
                "height": 2048
            },
            "prompt": "cute babies playing and enjoying",
            "contentClass": "photo",
            "visualIntensity": 2,
            "style": {
                "presets": [
                    "vibrant_colors"
                ],
                "strength": 90
            }
        };
        const url = 'https://firefly-api.adobe.io/v3/images/generate';
        const headers = {
            'X-Api-Key': env.ADOBE_CLIENT_ID,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };
        try {
            const response = await axios_1.default.post(url, body, { headers });
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.error('Error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    }
};
__decorate([
    (0, common_1.Get)('/token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransformController.prototype, "getToken", null);
__decorate([
    (0, common_1.Post)('/file'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TransformController.prototype, "handleImageUPload", null);
__decorate([
    (0, common_1.Get)('/generate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransformController.prototype, "generateImages", null);
TransformController = __decorate([
    (0, common_1.Controller)('transform'),
    __metadata("design:paramtypes", [firefly_service_1.FireflyService, transform_service_1.TransformService])
], TransformController);
exports.TransformController = TransformController;
//# sourceMappingURL=transform.controller.js.map