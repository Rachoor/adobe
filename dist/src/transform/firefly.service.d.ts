import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
export declare class FireflyService {
    private readonly httpService;
    private readonly authUrl;
    private readonly apiUrl;
    private readonly clientId;
    private readonly clientSecret;
    private accessToken;
    private tokenExpirationTime;
    private baseUrl;
    constructor(httpService: HttpService);
    authenticate(): Promise<void>;
    getAccessToken(): Promise<string>;
    getTransformations(): Promise<any>;
    sendToFirefly(filePath: string): Promise<Observable<AxiosResponse<any, any>>>;
    createHttpUrl(): void;
}
