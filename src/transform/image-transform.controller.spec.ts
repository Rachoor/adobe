import { Test, TestingModule } from '@nestjs/testing';
import { ImageTransformController } from './image-transform.controller';

describe('ImageTransformController', () => {
  let controller: ImageTransformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageTransformController],
    }).compile();

    controller = module.get<ImageTransformController>(ImageTransformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
