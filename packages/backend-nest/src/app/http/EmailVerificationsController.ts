import { Body, Controller, Get, Post, ValidationPipe, UsePipes } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DomainModel } from '../../database/models/DomainModel';
import { EmailModel } from '../../database/models/EmailModel';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import * as undici from 'undici';
import { ConfigService } from '@nestjs/config';
import { IsEmail } from 'class-validator';

class VerifyEmailDTO {
  @IsEmail()
  email: string;
}

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
          domain.*,
          email.*
      FROM email
      JOIN domain ON domain.id = email.domain_id
      ORDER BY email.last_verified_at`;

    const results = await this.sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    return results;
  }

  @Post('/verify')
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: VerifyEmailDTO) {
    const email = body.email;
    const domain = email.split('@')[1];

    const storedEmail = await this.emailsRepository.findOne({
      where: { email },
    });

    if (storedEmail) {
      return {
        email: storedEmail.email,
        result: storedEmail.verification_result,
      };
    }

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

    const [domainModel] = await this.domainsRepository.upsert({
      is_dns_valid_mx: verified.dnsValidMx,
      is_private_mail: verified.isPrivate,
      is_free_mail: verified.freemail,
      is_disposable_mail: verified.disposable,
      is_smtp_valid: verified.smtpValid,
      is_smtp_catch_all: verified.catchall,
      is_banned: verified.domainBanned,
      domain,
    });

    const emailModel = await this.emailsRepository.create({
      domain_id: domainModel.id,
      email,
      verification_result: verified.result,
      is_private: verified.isPrivate,
      last_verified_at: Date.now(),
      created_at: Date.now(),
    });

    return {
      email: emailModel.email,
      result: verified.result,
    };
  }
}
