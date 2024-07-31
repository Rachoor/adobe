import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { lastValueFrom, Observable } from 'rxjs';
import * as fs from 'fs';
import * as FormData from 'form-data';
import * as env from 'environment';

@Injectable()
export class FireflyService {
  private readonly authUrl: string;
  private readonly apiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private accessToken: string;
  private tokenExpirationTime: number;
  private baseUrl: string = env.BASE_URL;
    
    // autoTone
    // autoStraighten
    // presets
    // edit
    // exposure
    // contrast
    // sharpness
    // whitebalance
    // shadows
    // whites
    // blacks
    // clarity
    // texture
    // sharpendetail
    


  constructor(
    private readonly httpService: HttpService,
  ) {
      this.authUrl = env.ADOBE_AUTH_URL;
      this.apiUrl = env.ADOBE_API_URL;
      this.clientId = env.ADOBE_CLIENT_ID;
      this.clientSecret = env.ADOBE_SECET;
  }

    async authenticate(): Promise<void> {
    const payload = new URLSearchParams();
    payload.append('client_id', this.clientId);
    payload.append('client_secret', this.clientSecret);
    payload.append('grant_type', 'client_credentials');
    payload.append('scope', 'openid,AdobeID,session,additional_info,read_organizations,firefly_api,ff_apis');
        let response;

        try {
             response = await lastValueFrom(
                this.httpService.post(this.authUrl, payload, {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }),
            );
        } catch (error) {
                  console.error('Error fetching access token:', error);
      throw new HttpException('Failed to fetch access token', HttpStatus.INTERNAL_SERVER_ERROR);
    }
        
        // console.log('response', response);

    this.accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in; // typically in seconds
    this.tokenExpirationTime = Date.now() + expiresIn * 1000;
  }

  async getAccessToken(): Promise<string> {
    if (!this.accessToken || Date.now() >= this.tokenExpirationTime) {
      await this.authenticate();
    }
    return this.accessToken;
      }

  async getTransformations(): Promise<any> {
    const accessToken = await this.getAccessToken();

    const response = await lastValueFrom(
      this.httpService.get(`${this.apiUrl}/transformations`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );

    return response.data;
  }
    
    async sendToFirefly(filePath: string): Promise<Observable<AxiosResponse<any, any>>> {
        const accessToken = await this.getAccessToken();
        // console.log('accessToken', accessToken);
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    return this.httpService.post('https://firefly.adobe.io/v2/effects', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${accessToken}`, 
      },
    });
    }
    
    createHttpUrl() {
    
    }
  
  
  
}
