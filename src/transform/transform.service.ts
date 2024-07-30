import { FireflyService } from './firefly.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TransformService {

    constructor(private fireFlyService:FireflyService) {}

//     async getTransformations() {
//     try {
//       const transformations = await this.fireFlyService.getTransformations();
//       return transformations;
//     } catch (error) {
//       throw new HttpException(
//         error.response?.data || 'Failed to fetch transformations',
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }
}
