/// <reference types="multer" />
import { FireflyService } from './firefly.service';
export declare class TransformController {
    private fireflyService;
    constructor(fireflyService: FireflyService);
    getToken(): Promise<void>;
    transformImage(file: Express.Multer.File): Promise<any>;
}
