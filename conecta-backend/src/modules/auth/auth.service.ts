import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { DocumentType } from '../users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateOAuthLogin(profile: any, provider: string) {
    let user = await this.usersService.findByEmail(profile.email);

    if (!user) {
      // If user doesn't exist, create a new one based on OAuth profile
      user = await this.usersService.create({
        email: profile.email,
        nome: profile.name,
        provider,
        providerId: profile.id,
      });
    }

    return this.login(user);
  }

  async register(userData: any) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Processar imagem de perfil se existir
    let profileImageUrl = null;
    if (userData.profileImageUrl) {
      try {
        // Se a imagem já começa com data:image, é uma imagem base64
        if (userData.profileImageUrl.startsWith('data:image')) {
          // Salvar imagem em um diretório
          profileImageUrl = await this.saveProfileImage(userData.profileImageUrl, userData.email);
        } else {
          // Se não é base64, assume que é uma URL
          profileImageUrl = userData.profileImageUrl;
        }
      } catch (error) {
        console.error('Error saving profile image:', error);
      }
    }
    
    // Preparar os dados do usuário mapeando corretamente os campos do frontend
    const processedUserData = {
      id: uuidv4(),
      email: userData.email,
      password: userData.password,
      nome: userData.nome,
      telefone: userData.telefone,
      provider: 'local',
      
      // Campos de documento
      documentType: userData.documentType as DocumentType,
      cpf: userData.cpf,
      cnpj: userData.cnpj,
      
      // Dados pessoais
      dataNascimento: userData.dataNascimento ? new Date(userData.dataNascimento) : null,
      genero: userData.genero,
      
      // Endereço
      endereco: userData.endereco,
      numero: userData.numero,
      bairro: userData.bairro,
      cidade: userData.cidade,
      estado: userData.estado,
      pais: userData.pais,
      cep: userData.cep,
      
      // Dados profissionais
      professionalName: userData.professionalName,
      emailProfissional: userData.emailProfissional,
      telefoneProfissional: userData.telefoneProfissional,
      miniBio: userData.miniBio,
      localizacaoProfissional: userData.localizacaoProfissional,
      
      // Arrays de especialidades
      segmentos: userData.segmentos || [],
      habilidades: userData.habilidades || [],
      produtos: userData.produtos || [],
      
      // Redes sociais
      website: userData.website,
      instagram: userData.instagram,
      facebook: userData.facebook,
      linkedin: userData.linkedin,
      
      // Config de negócio
      possuiLojaTisica: userData.possuiLojaTisica,
      possuiEcommerce: userData.possuiEcommerce,
      
      // Imagem de perfil
      profileImageUrl,
      
      // Role baseado no tipo de usuário
      roles: this.mapRoleFromUserData(userData.role),
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(processedUserData.password, 10);
    processedUserData.password = hashedPassword;
    
    // Create new user
    const newUser = await this.usersService.create(processedUserData);

    // Remove password from response
    const { password, ...result } = newUser;
    return this.login(result);
  }
  
  private mapRoleFromUserData(role: string): string[] {
    switch(role) {
      case 'profissional':
        return ['professional'];
      case 'marca':
        return ['enterprise'];
      case 'fornecedor':
        return ['supplier'];
      default:
        return ['user'];
    }
  }

  private async saveProfileImage(base64Data: string, userEmail: string): Promise<string> {
    try {
      // Extrair a parte de dados da string base64
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
      }
      
      const type = matches[1];
      const data = Buffer.from(matches[2], 'base64');
      
      // Determinar a extensão do arquivo com base no tipo mime
      let extension = '';
      if (type === 'image/jpeg') extension = '.jpg';
      else if (type === 'image/png') extension = '.png';
      else if (type === 'image/webp') extension = '.webp';
      else extension = '.jpg'; // Padrão
      
      // Gerar nome de arquivo único
      const fileName = `profile_${uuidv4()}${extension}`;
      
      // Garantir que o diretório existe
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Caminho completo do arquivo
      const filePath = path.join(uploadsDir, fileName);
      
      // Salvar o arquivo
      fs.writeFileSync(filePath, data);
      
      // Retornar URL relativa
      return `/uploads/${fileName}`;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }
} 