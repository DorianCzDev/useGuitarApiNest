import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryMethodsController } from './delivery-methods.controller';

describe('DeliveryMethodsController', () => {
  let controller: DeliveryMethodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryMethodsController],
    }).compile();

    controller = module.get<DeliveryMethodsController>(DeliveryMethodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
