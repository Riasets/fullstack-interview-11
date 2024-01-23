import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DomainModel } from '../../database/models/DomainModel';
import { EmailModel } from '../../database/models/EmailModel';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import * as undici from 'undici';
import { ConfigService } from '@nestjs/config';

@Controller({
  path: '/',
})
export class EmailVerificationsController {
  constructor(
    private configService: ConfigService,
    private sequelize: Sequelize,
    @InjectModel(DomainModel) private domainsRepository: typeof DomainModel,
    @InjectModel(EmailModel) private emailsRepository: typeof EmailModel,
  ) {}

  @Get('/emails')
  async getAll() {
    const sql = `
      SELECT
          email.*,
          domain.*
      FROM email
      JOIN domain ON domain.id = email.domain_id
      ORDER BY email.last_verified_at`;

    const results = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return results;
  }

  @Post('/verify')
  async create(@Body() body: any) {
    const email = body.email;
    const domain = email.split('@')[1];

    const prospectConfig = {
      baseUrl: this.configService.get('PROSPECT_BASE_URL'),
      apiKey: this.configService.get('PROSPECT_API_KEY'),
    };

    const res = await undici.request(prospectConfig.baseUrl + '/api/v1/email-verifier', {
      method: 'POST',
      body: JSON.stringify({
        email: [email],
      }),
      headers: {
        'Authorization': 'Bearer ' + prospectConfig.apiKey,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.body.json() as any;
    const verified = data.result[0];

    const [domainModel] = await this.domainsRepository.findOrCreate({
      where: { domain },
    });

    const [emailModel] = await this.emailsRepository.findOrCreate({
      where: {
        domain_id: domainModel.id,
        email,
      },
      defaults: {
        verification_result: verified.result,
      },
    });

    return {
      email: emailModel.email,
      result: emailModel.verification_result,
    };
  }
}
