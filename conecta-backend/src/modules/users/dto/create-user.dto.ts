import { IsEmail, IsString, IsOptional, IsArray, IsBoolean, IsEnum, IsDate, IsObject } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UserRole, DocumentType, Gender } from '../entities/user.entity';

export class SocialLinksDto {
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
}

export class AddressDto {
  @IsString()
  zipCode: string;

  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;
}

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
  name?: string;
  
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @Type(() => Date)
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsDate()
  birthDate?: Date;

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
  hasEcommerce?: boolean;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: SocialLinksDto;
  
  @IsOptional()
  @IsString()
  professionalName?: string;

  @IsOptional()
  @IsString()
  professionalEmail?: string;

  @IsOptional()
  @IsString()
  professionalPhone?: string;

  @IsOptional()
  @IsString()
  professionalLocation?: string;
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  segments?: string[];
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products?: string[];
  
  @IsOptional()
  @IsObject()
  address?: AddressDto;
} 