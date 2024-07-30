"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformModule = void 0;
const common_1 = require("@nestjs/common");
const transform_service_1 = require("./transform.service");
const transform_controller_1 = require("./transform.controller");
const typeorm_1 = require("@nestjs/typeorm");
const Image_entity_1 = require("./Image.entity");
const firefly_service_1 = require("./firefly.service");
const axios_1 = require("@nestjs/axios");
const image_transform_controller_1 = require("./image-transform.controller");
let TransformModule = class TransformModule {
};
TransformModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Image_entity_1.Image]),
            axios_1.HttpModule,
        ],
        providers: [transform_service_1.TransformService, firefly_service_1.FireflyService],
        controllers: [transform_controller_1.TransformController, image_transform_controller_1.ImageTransformController]
    })
], TransformModule);
exports.TransformModule = TransformModule;
//# sourceMappingURL=transform.module.js.map