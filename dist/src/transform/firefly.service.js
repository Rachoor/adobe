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
exports.FireflyService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const fs = require("fs");
const FormData = require("form-data");
const env = require("../../environment");
let FireflyService = class FireflyService {
    constructor(httpService) {
        this.httpService = httpService;
        this.baseUrl = env.BASE_URL;
        this.authUrl = env.ADOBE_AUTH_URL;
        this.apiUrl = env.ADOBE_API_URL;
        this.clientId = env.ADOBE_CLIENT_ID;
        this.clientSecret = env.ADOBE_SECET;
    }
    async authenticate() {
        const payload = new URLSearchParams();
        payload.append('client_id', this.clientId);
        payload.append('client_secret', this.clientSecret);
        payload.append('grant_type', 'client_credentials');
        payload.append('scope', 'openid,AdobeID,session,additional_info,read_organizations,firefly_api,ff_apis');
        let response;
        try {
            response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(this.authUrl, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }));
        }
        catch (error) {
            console.error('Error fetching access token:', error);
            throw new common_1.HttpException('Failed to fetch access token', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        console.log('response', response);
        this.accessToken = response.data.access_token;
        const expiresIn = response.data.expires_in;
        this.tokenExpirationTime = Date.now() + expiresIn * 1000;
    }
    async getAccessToken() {
        if (!this.accessToken || Date.now() >= this.tokenExpirationTime) {
            await this.authenticate();
        }
        return this.accessToken;
    }
    async getTransformations() {
        const accessToken = await this.getAccessToken();
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${this.apiUrl}/transformations`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        }));
        return response.data;
    }
    async sendToFirefly(filePath) {
        const accessToken = await this.getAccessToken();
        console.log('accessToken', accessToken);
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        return this.httpService.post('https://firefly.adobe.io/v2/effects', form, {
            headers: Object.assign(Object.assign({}, form.getHeaders()), { 'Authorization': `Bearer ${accessToken}` }),
        });
    }
    createHttpUrl() {
    }
};
FireflyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], FireflyService);
exports.FireflyService = FireflyService;
//# sourceMappingURL=firefly.service.js.map