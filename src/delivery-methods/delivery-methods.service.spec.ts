import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryMethodsService } from './delivery-methods.service';

describe('DeliveryMethodsService', () => {
  let service: DeliveryMethodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryMethodsService],
    }).compile();

    service = module.get<DeliveryMethodsService>(DeliveryMethodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
