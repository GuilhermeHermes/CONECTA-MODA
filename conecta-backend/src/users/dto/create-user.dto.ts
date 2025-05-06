import { IsEmail, IsString, IsOptional, IsArray, IsBoolean, IsEnum, IsDate, IsObject } from 'class-validator';
import { UserRole, DocumentType } from '../entities/user.entity';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];
  
  @IsOptional()
  @IsString()
  role?: 'profissional' | 'marca' | 'fornecedor';

  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @IsOptional()
  @IsString()
  miniBio?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  hasPhysicalStore?: boolean;
  
  @IsOptional()
  @IsBoolean()
  possuiLojaTisica?: boolean;

  @IsOptional()
  @IsBoolean()
  hasEcommerce?: boolean;
  
  @IsOptional()
  @IsBoolean()
  possuiEcommerce?: boolean;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  socialLinks?: Record<string, any>;
  
  @IsOptional()
  @IsString()
  website?: string;
  
  @IsOptional()
  @IsString()
  instagram?: string;
  
  @IsOptional()
  @IsString()
  facebook?: string;
  
  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  professionalName?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsOptional()
  @IsString()
  cpf?: string;
  
  @IsOptional()
  @IsDate()
  dataNascimento?: Date;
  
  @IsOptional()
  @IsString()
  genero?: string;
  
  @IsOptional()
  @IsString()
  emailProfissional?: string;
  
  @IsOptional()
  @IsString()
  telefoneProfissional?: string;
  
  @IsOptional()
  @IsString()
  localizacaoProfissional?: string;
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  segmentos?: string[];
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  habilidades?: string[];
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  produtos?: string[];
  
  // Campos para endereço
  @IsOptional()
  @IsString()
  endereco?: string;
  
  @IsOptional()
  @IsString()
  numero?: string;
  
  @IsOptional()
  @IsString()
  bairro?: string;
  
  @IsOptional()
  @IsString()
  cidade?: string;
  
  @IsOptional()
  @IsString()
  estado?: string;
  
  @IsOptional()
  @IsString()
  pais?: string;
  
  @IsOptional()
  @IsString()
  cep?: string;
  
  @IsOptional()
  @IsString()
  telefone?: string;
} 