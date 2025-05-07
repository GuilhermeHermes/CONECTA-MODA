import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByRole(role: string): Promise<User[]> {
    return this.usersRepository.find({
      where: {
        roles: Like(`%${role}%`)
      }
    });
  }

  async findOne(id: string): Promise<User> {
    console.log('Buscando usuário com ID:', id);
    const user = await this.usersRepository.findOne({ 
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        genero: true,
        dataNascimento: true,
        cpf: true,
        cnpj: true,
        endereco: true,
        numero: true,
        bairro: true,
        cidade: true,
        estado: true,
        pais: true,
        cep: true,
        professionalName: true,
        emailProfissional: true,
        telefoneProfissional: true,
        miniBio: true,
        localizacaoProfissional: true,
        segmentos: true,
        habilidades: true,
        produtos: true,
        website: true,
        instagram: true,
        facebook: true,
        linkedin: true,
        possuiLojaTisica: true,
        possuiEcommerce: true,
        profileImageUrl: true,
        roles: true,
        createdAt: true,
        updatedAt: true
      }
    });
    console.log('Usuário encontrado:', user);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'nome', 'password', 'roles', 'provider', 'providerId'] 
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
} 