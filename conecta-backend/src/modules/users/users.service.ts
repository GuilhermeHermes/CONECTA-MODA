import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, ArrayContains, ILike } from 'typeorm';
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
    if (!createUserDto.id) {
      createUserDto.id = uuidv4();
    }
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const roles = createUserDto.roles || [UserRole.DEFAULT];
    
    const userData = {
      id: createUserDto.id,
      email: createUserDto.email,
      password: hashedPassword,
      roles,
      name: createUserDto.name,
      phone: createUserDto.phone,
      documentType: createUserDto.documentType,
      documentNumber: createUserDto.documentNumber,
      gender: createUserDto.gender,
      birthDate: createUserDto.birthDate,
      specialties: createUserDto.specialties || [],
      miniBio: createUserDto.miniBio,
      hasPhysicalStore: createUserDto.hasPhysicalStore,
      hasEcommerce: createUserDto.hasEcommerce,
      profilePicture: createUserDto.profilePicture,
      website: createUserDto.socialLinks?.website,
      instagram: createUserDto.socialLinks?.instagram,
      facebook: createUserDto.socialLinks?.facebook,
      linkedin: createUserDto.socialLinks?.linkedin,
      professionalName: createUserDto.professionalName,
      professionalEmail: createUserDto.professionalEmail,
      professionalPhone: createUserDto.professionalPhone,
      professionalLocation: createUserDto.professionalLocation,
      segments: createUserDto.segments || [],
      skills: createUserDto.skills || [],
      products: createUserDto.products || [],
    };
    
    const user = this.usersRepository.create(userData);
    const savedUser = await this.usersRepository.save(user);
    
    if (createUserDto.address) {
      const addressData = {
        id: uuidv4(),
        userId: savedUser.id,
        street: createUserDto.address.street,
        number: createUserDto.address.number,
        neighborhood: createUserDto.address.neighborhood,
        city: createUserDto.address.city,
        state: createUserDto.address.state,
        country: createUserDto.address.country,
        zipCode: createUserDto.address.zipCode,
        complement: createUserDto.address.complement
      };
      
      const address = this.addressesRepository.create(addressData);
      const savedAddress = await this.addressesRepository.save(address);
      
      savedUser.address = savedAddress;
      await this.usersRepository.save(savedUser);
    }
    
    return this.findOne(savedUser.id);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['address', 'accounts'],
    });
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: ['address', 'accounts'],
    });
    return users.filter(user => Array.isArray(user.roles) && user.roles.includes(role));
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

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['address', 'accounts'],
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'name', 'password', 'roles'],
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