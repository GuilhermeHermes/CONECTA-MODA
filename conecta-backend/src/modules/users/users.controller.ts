import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  private processUserUrls(user: User): User {
    const backendUrl = this.configService.get('BACKEND_URL') || 'http://localhost:3001';
    
    if (user.profileImageUrl && !user.profileImageUrl.startsWith('http')) {
      user.profileImageUrl = `${backendUrl}${user.profileImageUrl}`;
    }
    
    return user;
  }

  private processUsersUrls(users: User[]): User[] {
    return users.map(user => this.processUserUrls(user));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    return this.processUsersUrls(users);
  }

  @UseGuards(JwtAuthGuard)
  @Get('professionals')
  async findProfessionals(): Promise<User[]> {
    const users = await this.usersService.findByRole('professional');
    return this.processUsersUrls(users);
  }

  @UseGuards(JwtAuthGuard)
  @Get('suppliers')
  async findSuppliers(): Promise<User[]> {
    const users = await this.usersService.findByRole('supplier');
    return this.processUsersUrls(users);
  }

  @UseGuards(JwtAuthGuard)
  @Get('enterprises')
  async findEnterprises(): Promise<User[]> {
    const users = await this.usersService.findByRole('enterprise');
    return this.processUsersUrls(users);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    return this.processUserUrls(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: Partial<User>): Promise<User> {
    const user = await this.usersService.update(id, userData);
    return this.processUserUrls(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
} 