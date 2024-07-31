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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformService = void 0;
const firefly_service_1 = require("./firefly.service");
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const axios_1 = require("axios");
const env = require("../../environment");
let TransformService = class TransformService {
    constructor(fireFlyService) {
        this.fireFlyService = fireFlyService;
    }
    getStorageOptions() {
        return (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                callback(null, filename);
            }
        });
    }
    async transformanImage(file, body) {
        const accessToken = await this.fireFlyService.getAccessToken();
        const images = await this.sendImageToAdobe(file, accessToken);
        console.log('IMAGES:', images);
        this.expandImage(1024, 1024, images[0].id, env.ADOBE_CLIENT_ID, accessToken);
    }
    async expandImage(width, height, imageId, id, token, prompt, alignment) {
        let apiUrl = 'https://firefly-api.adobe.io/v1/images/expand';
        let body = {
            numVariations: 1,
            size: {
                width,
                height,
            },
            image: {
                source: {
                    uploadId: imageId,
                },
                id: imageId
            },
        };
        if (prompt)
            body.prompt = prompt;
        if (alignment)
            body.placement = { alignment };
        const headers = {
            'X-Api-Key': id,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
        console.log("BODY::::", body, headers);
        try {
            const response = await axios_1.default.post(apiUrl, body, { headers });
            return response.data;
        }
        catch (error) {
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                console.error('Error Response Status:', error.response.status);
                console.error('Error Response Headers:', error.response.headers);
            }
            else {
                console.error('Error Message:', error.message);
            }
        }
    }
    async sendImageToAdobe(file, accessToken) {
        var _a;
        const url = 'https://firefly-api.adobe.io/v2/storage/image';
        const headers = {
            'X-Api-Key': env.ADOBE_CLIENT_ID,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'image/jpeg'
        };
        try {
            const response = await axios_1.default.post(url, file, { headers });
            return response.data.images;
        }
        catch (err) {
            console.error('Error:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
        }
    }
};
TransformService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firefly_service_1.FireflyService])
], TransformService);
exports.TransformService = TransformService;
//# sourceMappingURL=transform.service.js.map