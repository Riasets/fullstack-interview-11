import {
  AutoIncrement,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { DomainModel } from './DomainModel';

@Table({
  tableName: 'email',
  timestamps: false,
})
export class EmailModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataTypes.BIGINT.UNSIGNED)
  id: number;

  @ForeignKey(() => DomainModel)
  @Column(DataTypes.BIGINT.UNSIGNED)
  domain_id: number;

  @Unique
  @Column
  email: string;

  @Column
  verification_result: 'valid' | 'unknown' | 'invalid';

  @Column
  is_private: boolean;

  @Column
  last_verified_at: Date;

  @CreatedAt
  @Column
  created_at: Date;
}
