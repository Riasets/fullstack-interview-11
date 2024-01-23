import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { DomainModel } from './models/DomainModel';
import { EmailModel } from './models/EmailModel';

const models = SequelizeModule.forFeature([
  DomainModel,
  EmailModel,
]);

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nestLogger = new Logger('Sequelize');

        return {
          dialect: 'mysql',
          host: configService.get('MYSQL_HOST'),
          port: +configService.get('MYSQL_PORT'),
          username: configService.get('MYSQL_USER'),
          password: configService.get('MYSQL_PASSWORD'),
          database:
            configService.get('NODE_ENV') !== 'test'
              ? configService.get('MYSQL_DATABASE')
              : configService.get('MYSQL_DATABASE') + '_tests',
          autoLoadModels: true,
          synchronize: true,
          logging: (msg: any) => {
            nestLogger.debug(msg);
          },
          pool: {
            max: 20,
            min: 0,
            idle: 10_000,
            acquire: 60_000,
            evict: 1_000,
          },
          retry: {
            match: [
              'Lock wait timeout exceeded; try restarting transaction',
            ],
            max: 3,
          },
        };
      },
    }),
  ],
  providers: models.providers,
  exports: models.exports,
})
export class DatabaseModule {}
