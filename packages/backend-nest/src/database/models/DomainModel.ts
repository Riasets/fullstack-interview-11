import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'domain',
  timestamps: false,
})
export class DomainModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.BIGINT.UNSIGNED)
  id: number;

  @Unique
  @Column
  domain: string;

  @Column
  is_dns_valid: boolean;

  @Column
  is_dns_valid_mx: boolean;

  @Column
  is_private_mail: boolean;

  @Column
  is_free_mail: boolean;

  @Column
  is_disposable_mail: boolean;

  @Column
  is_smtp_valid: boolean;

  @Column
  is_smtp_catch_all: boolean;

  @Column
  is_banned: boolean;
}
