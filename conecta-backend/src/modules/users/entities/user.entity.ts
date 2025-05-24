import { Entity, Column, PrimaryColumn, OneToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Address } from './address.entity';
import { Account } from './account.entity';

export enum UserRole {
  DEFAULT = 'DEFAULT',
  PROFESSIONAL = 'PROFESSIONAL',
  SUPPLIER = 'SUPPLIER',
  BRAND = 'BRAND',
}

export enum DocumentType {
  CPF = 'cpf',
  CNPJ = 'cnpj',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
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

  @Column({ nullable: true })
  documentNumber?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ nullable: true })
  professionalName?: string;

  @Column({ nullable: true })
  professionalEmail?: string;

  @Column({ nullable: true })
  professionalPhone?: string;

  @Column({ nullable: true })
  professionalLocation?: string;

  @Column('text', { array: true, default: [] })
  segments: string[];

  @Column('text', { array: true, default: [] })
  skills: string[];

  @Column('text', { array: true, default: [] })
  products: string[];

  @OneToOne(() => Address, address => address.user)
  address?: Address;

  @OneToMany(() => Account, account => account.user)
  accounts: Account[];
} 