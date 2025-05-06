import { IsEmail, IsString, IsOptional, IsArray, IsBoolean, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles: UserRole[];

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @IsOptional()
  @IsString()
  miniBio?: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsBoolean()
  hasPhysicalStore?: boolean;

  @IsOptional()
  @IsBoolean()
  hasEcommerce?: boolean;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  socialLinks?: Record<string, any>;

  @IsOptional()
  @IsString()
  professionalName?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsOptional()
  @IsString()
  cpf?: string;
} 