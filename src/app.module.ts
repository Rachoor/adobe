import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransformModule } from './transform/transform.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Image } from './transform/Image.entity';
import { APP_PIPE } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Image],
      synchronize: true,
    }),
    
    MulterModule.register(
      {
        dest:'./uploads'
      }
    ),
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    
 
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       synchronize: true,
    //       entities: [Image],
    //     };
    //   },
    // }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'), // Serve static files from the uploads folder
    //   serveRoot: '/uploads' // The path to serve files from
    // }),
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: './uploads',
    //     filename: (req, file, cb) => {
    //       const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
    //       cb(null, uniqueSuffix);
    //     },
    //   }),
    // }),
    TransformModule,
    TransformModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
     {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
