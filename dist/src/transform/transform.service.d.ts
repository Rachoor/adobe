/// <reference types="multer" />
import { FireflyService } from './firefly.service';
export declare class TransformService {
    private fireFlyService;
    constructor(fireFlyService: FireflyService);
    getStorageOptions(): import("multer").StorageEngine;
    transformanImage(file: Express.Multer.File, body: any): Promise<any>;
    expandImage(width: number, height: number, imageId: string, id: string, token: string, prompt?: string, alignment?: string): Promise<any>;
    sendImageToAdobe(file: Express.Multer.File, accessToken: string): Promise<any>;
}
