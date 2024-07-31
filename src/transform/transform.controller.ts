import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TransformService } from './transform.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FireflyService } from './firefly.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as env from 'environment';
import axios from 'axios';


const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    callback(null, filename);
  }
});


@Controller('transform')
export class TransformController {
    constructor(private fireflyService: FireflyService, private transformService: TransformService) { }

@Get('/token')
async getToken() {
    console.log('coming');
    this.fireflyService.getAccessToken();
    const token = await this.fireflyService.getAccessToken();
    console.log('token',token);
}
    
@Post('/file')
@UseInterceptors(FileInterceptor('file', {storage}))
handleImageUPload(@UploadedFile() file: Express.Multer.File) {
    const response = this.transformService.transformanImage(file, {title: 'test title', description: 'test description'});
   return {
      message: 'File uploaded successfully',
      file: response,
    };
}
    
@Get('/generate')
async generateImages() {
    const accessToken = await this.fireflyService.getAccessToken();
    // let body = {
    //     "n": 4,
    //     "prompt":'a cat dancing on a rainbow'
    // };
    let body = {
        "numVariations": 2,
        "seeds": [
            0,4999
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
    const response = await axios.post(url, body, { headers });
        console.log(response.data);
        return response.data;
    } catch (error) {
  console.error('Error:', error.response?.data || error.message);
    }

	// return await req.json();
}
    
}
