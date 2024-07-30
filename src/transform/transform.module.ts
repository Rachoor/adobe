import { Module } from '@nestjs/common';
import { TransformService } from './transform.service';
import { TransformController } from './transform.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './Image.entity';
import { FireflyService } from './firefly.service';
import { HttpModule } from '@nestjs/axios';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { ImageTransformController } from './image-transform.controller';



@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    HttpModule,
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: './uploads',
    //     filename: (req, file, cb) => {
    //       const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
    //       cb(null, uniqueSuffix);
    //     },
    //   }),
    // }),
  ],
  providers: [TransformService, FireflyService],
  controllers: [TransformController, ImageTransformController]
})
export class TransformModule {}
