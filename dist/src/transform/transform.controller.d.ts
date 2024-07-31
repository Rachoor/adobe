/// <reference types="multer" />
import { TransformService } from './transform.service';
import { FireflyService } from './firefly.service';
export declare class TransformController {
    private fireflyService;
    private transformService;
    constructor(fireflyService: FireflyService, transformService: TransformService);
    getToken(): Promise<void>;
    handleImageUPload(file: Express.Multer.File): {
        message: string;
        file: Promise<any>;
    };
    generateImages(): Promise<any>;
}
