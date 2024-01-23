import { Module, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { DatabaseModule } from './DatabaseModule';
import { EmailModel } from './models/EmailModel';
import { DomainModel } from './models/DomainModel';

@Module({
  imports: [DatabaseModule],
})
export class TestDatabaseModule implements OnModuleInit {
  constructor(private sequelize: Sequelize,) {}

  async onModuleInit() {
    this.assertTestDatabaseUsed();

    await this.clearTables();
  }

  assertTestDatabaseUsed() {
    const dbName = this.sequelize.getDatabaseName();
    if (dbName.startsWith('test') || dbName.endsWith('test')) {
      return;
    }

    throw new Error('Test database name should start or end with "test"');
  }

  async clearTables() {
    // NOTE: clearing and seeding the list on every test looks stupid
    // await this.sequelize.getRepository(TheListModel).destroy({ truncate: true });

    await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    await this.sequelize.getRepository(EmailModel).destroy({ truncate: true });
    await this.sequelize.getRepository(DomainModel).destroy({ truncate: true });

    await this.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
}
