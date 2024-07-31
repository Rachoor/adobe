import { FireflyService } from './firefly.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import axios from 'axios';
import * as fs from 'fs';
import * as FormData from 'form-data';
import * as env from 'environment';


@Injectable()
export class TransformService {

    constructor(private fireFlyService: FireflyService) { }
    
  getStorageOptions() {
    return diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      }
    });
  }


  async transformanImage(file: Express.Multer.File, body: any): Promise<any> {
    // async sendFileToAdobe(): Promise<any> {
    const accessToken = await this.fireFlyService.getAccessToken();
    const images = await this.sendImageToAdobe(file, accessToken);
    console.log('IMAGES:', images);
    // if (images) {
    // const url = 'https://firefly-api.adobe.io/v3/images/expand';
    // const headers = {
    // 'X-Api-Key': env.ADOBE_CLIENT_ID,
    // 'Authorization': `Bearer ${accessToken}`,
    // 'Content-Type': 'application/json'
    // };
    //   let body = {
    //     numVariations: 1,
    //     size: {
    //       width: 2048,
    //       height: 2048
    //     },
    //     image: {
    //       source: {
    //         uploadId: images[0].id
    //       }
    //     }
    //   }

    // try {
    //   const response = await axios.post(url, body, { headers });
      
    //   return response;
    // } catch (err) {
    //   // console.log(err.response);
    //   if (err.response) {
    //     console.error('Error Response Data:', err.response.data);
    //     console.error('Error Response Status:', err.response.status);
    //     console.error('Error Response Headers:', err.response.headers);
    //   }
    //   console.error('Error:', err.response?.data || err.message);
    // }
    // }
    this.expandImage(1024,1024,images[0].id, env.ADOBE_CLIENT_ID, accessToken )
  }

  async expandImage(
    width: number,
    height: number,
    imageId: string,
    id: string,
    token: string,
    prompt?: string,
    alignment?: string,
  ): Promise<any> {
   let apiUrl = 'https://firefly-api.adobe.io/v1/images/expand';
    let body: any = {
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

    if (prompt) body.prompt = prompt;
    if (alignment) body.placement = { alignment };

    const headers = {
      'X-Api-Key': id, 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    console.log("BODY::::",body, headers);

    try {
      const response = await axios.post(apiUrl, body, { headers });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', error.response.headers);
      } else {
        console.error('Error Message:', error.message);
      }
      // throw new HttpException(
      //   `Image expansion failed: ${error.message}`,
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  async sendImageToAdobe(file: Express.Multer.File, accessToken:string) {
    const url = 'https://firefly-api.adobe.io/v2/storage/image';
      const headers = {
    'X-Api-Key': env.ADOBE_CLIENT_ID,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'image/jpeg'
      };
    try {
      const response = await axios.post(url, file, { headers });
      
      return response.data.images;
    } catch (err) {
        console.error('Error:', err.response?.data || err.message);
    }
  }

}
