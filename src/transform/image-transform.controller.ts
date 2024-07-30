import { Controller, Get } from '@nestjs/common';

@Controller('image-transform')
export class ImageTransformController {

    @Get('/hello-world')
    helloWorld() {
        console.log('coming');
    }
}
