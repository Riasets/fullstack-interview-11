import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './HealthController';
import { AppModule } from '../AppModule'
import { TestDatabaseModule } from '../../database/TestDatabaseModule'
import { TestRedisModule } from '../../redis/TestRedisModule'

describe('AppController', () => {
  let app: TestingModule;
  let healthController: HealthController;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule, TestDatabaseModule, TestRedisModule],
    }).compile();

    await app.init();

    healthController = app.get(HealthController);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('root', () => {
    it('should return ok status', async () => {
      expect(await healthController.getStatus()).toStrictEqual({
        mysqlStatus: 'ok',
        redisStatus: 'ok',
      });
    });
  });
});
