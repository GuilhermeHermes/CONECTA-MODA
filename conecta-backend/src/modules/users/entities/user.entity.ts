import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DocumentType {
  CPF = 'cpf',
  CNPJ = 'cnpj',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  cnpj: string;
  
  @Column({ type: 'enum', enum: DocumentType, nullable: true })
  documentType: DocumentType;

  @Column({ nullable: true, type: 'date' })
  dataNascimento: Date;

  @Column({ nullable: true })
  genero: string;

  @Column({ nullable: true })
  endereco: string;

  @Column({ nullable: true })
  numero: string;

  @Column({ nullable: true })
  bairro: string;

  @Column({ nullable: true })
  cidade: string;

  @Column({ nullable: true })
  pais: string;

  @Column({ nullable: true })
  estado: string;
  
  @Column({ nullable: true })
  cep: string;

  @Column({ default: 'local' })
  provider: string;

  @Column({ nullable: true })
  providerId: string;

  @Column({ type: 'simple-array', default: 'user' })
  roles: string[];
  
  @Column({ nullable: true })
  professionalName: string;

  @Column({ nullable: true })
  emailProfissional: string;

  @Column({ nullable: true })
  telefoneProfissional: string;

  @Column({ nullable: true })
  miniBio: string;

  @Column({ nullable: true })
  localizacaoProfissional: string;
  
  @Column({ type: 'simple-array', nullable: true })
  segmentos: string[];
  
  @Column({ type: 'simple-array', nullable: true })
  habilidades: string[];
  
  @Column({ type: 'simple-array', nullable: true })
  produtos: string[];
  
  @Column({ nullable: true })
  website: string;
  
  @Column({ nullable: true })
  instagram: string;
  
  @Column({ nullable: true })
  facebook: string;
  
  @Column({ nullable: true })
  linkedin: string;
  
  @Column({ nullable: true })
  possuiLojaTisica: boolean;
  
  @Column({ nullable: true })
  possuiEcommerce: boolean;

  @Column({ nullable: true, type: 'text' })
  profileImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 