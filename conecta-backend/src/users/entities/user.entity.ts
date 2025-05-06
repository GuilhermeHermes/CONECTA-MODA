import { Entity, Column, PrimaryColumn, OneToOne, OneToMany } from 'typeorm';
import { Address } from './address.entity';
import { Account } from './account.entity';

export enum UserRole {
  DEFAULT = 'DEFAULT',
  PROFESSIONAL = 'PROFESSIONAL',
  SUPPLIER = 'SUPPLIER',
  ENTERPRISE = 'ENTERPRISE',
}

export enum DocumentType {
  CPF = 'cpf',
  CNPJ = 'cnpj',
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.DEFAULT],
  })
  roles: UserRole[];

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'enum', enum: DocumentType, nullable: true })
  documentType?: DocumentType;

  @Column('text', { array: true, default: [] })
  specialties: string[];

  @Column({ nullable: true })
  miniBio?: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  hasPhysicalStore?: boolean;

  @Column({ nullable: true })
  hasEcommerce?: boolean;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('jsonb', { nullable: true })
  socialLinks?: Record<string, any>;

  @Column({ nullable: true })
  professionalName?: string;

  @Column({ nullable: true })
  cnpj?: string;

  @Column({ nullable: true })
  cpf?: string;

  @Column({ nullable: true })
  dataNascimento?: Date;

  @Column({ nullable: true })
  genero?: string;

  @Column({ nullable: true })
  emailProfissional?: string;

  @Column({ nullable: true })
  telefoneProfissional?: string;

  @Column({ nullable: true })
  localizacaoProfissional?: string;

  @Column('text', { array: true, default: [] })
  segmentos: string[];

  @Column('text', { array: true, default: [] })
  habilidades: string[];

  @Column('text', { array: true, default: [] })
  produtos: string[];

  @OneToOne(() => Address, address => address.user)
  address?: Address;

  @OneToMany(() => Account, account => account.user)
  accounts: Account[];
} 