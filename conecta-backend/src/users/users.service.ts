import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { Account } from './entities/account.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Se não for fornecido um ID, gerar um UUID
    if (!createUserDto.id) {
      createUserDto.id = uuidv4();
    }
    
    // Hash da senha se fornecida
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Mapear o role do frontend para UserRole enum
    let roles = createUserDto.roles || [UserRole.DEFAULT];
    if (createUserDto.role === 'profissional') {
      roles = [UserRole.PROFESSIONAL];
    } else if (createUserDto.role === 'fornecedor') {
      roles = [UserRole.SUPPLIER];
    } else if (createUserDto.role === 'marca') {
      roles = [UserRole.ENTERPRISE];
    }
    
    // Construir o objeto de links sociais
    const socialLinks = {};
    if (createUserDto.website) socialLinks['website'] = createUserDto.website;
    if (createUserDto.instagram) socialLinks['instagram'] = createUserDto.instagram;
    if (createUserDto.facebook) socialLinks['facebook'] = createUserDto.facebook;
    if (createUserDto.linkedin) socialLinks['linkedin'] = createUserDto.linkedin;
    
    // Criar o usuário com todos os dados do formulário
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roles,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : null,
      hasPhysicalStore: createUserDto.possuiLojaTisica,
      hasEcommerce: createUserDto.possuiEcommerce,
    });
    
    // Salvar o usuário
    const savedUser = await this.usersRepository.save(user);
    
    // Se fornecido dados de endereço, criar o endereço
    if (createUserDto.endereco && createUserDto.cidade && createUserDto.estado) {
      const address = this.addressesRepository.create({
        id: uuidv4(),
        userId: savedUser.id,
        street: createUserDto.endereco,
        number: createUserDto.numero,
        bairro: createUserDto.bairro,
        city: createUserDto.cidade,
        state: createUserDto.estado,
        country: createUserDto.pais || 'Brasil',
        cep: createUserDto.cep || '',
      });
      await this.addressesRepository.save(address);
    }
    
    return this.findOne(savedUser.id);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['address', 'accounts'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['address', 'accounts'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['address', 'accounts'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async addRole(id: string, role: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user.roles.includes(role as any)) {
      user.roles = [...user.roles, role as any];
      return this.usersRepository.save(user);
    }
    return user;
  }

  async removeRole(id: string, role: string): Promise<User> {
    const user = await this.findOne(id);
    user.roles = user.roles.filter(r => r !== role);
    return this.usersRepository.save(user);
  }
} 