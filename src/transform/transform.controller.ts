import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TransformService } from './transform.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FireflyService } from './firefly.service';


@Controller('transform')
export class TransformController {
    constructor(private fireflyService: FireflyService) { }

@Get('/token')
async getToken() {
    console.log('coming');
    this.fireflyService.getAccessToken();
    const token = await this.fireflyService.getAccessToken();
    console.log('token',token);
}
    
@Post()
@UseInterceptors(FileInterceptor('file'))
async transformImage(@UploadedFile() file: Express.Multer.File) {
    const result = await (await this.fireflyService.sendToFirefly(file.path)).toPromise();
    return result.data;
  }
}
