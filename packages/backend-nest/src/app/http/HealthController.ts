import { Controller, Get } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { InjectRedis } from '../../redis/InjectRedis.decorator';
import { RedisClient } from '../../redis/RedisClient';

@Controller()
export class HealthController {
  constructor(
    private sequelize: Sequelize,
    @InjectRedis() private redis: RedisClient,
  ) {}

  @Get()
  async getStatus() {
    let mysqlStatus = 'ok';
    try {
      await this.sequelize.query('show tables', {
        type: QueryTypes.SELECT,
      });
    } catch (e) {
      mysqlStatus = e.message;
    }

    let redisStatus = 'ok';
    try {
      await this.redis.info('server');
    } catch (e) {
      redisStatus = e.message;
    }

    return { mysqlStatus, redisStatus };
  }
}
