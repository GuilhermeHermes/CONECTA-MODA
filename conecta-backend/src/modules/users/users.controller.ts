import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { FilterUsersDto } from './dto/filter-users.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  private processUserUrls(user: User): User {
    const backendUrl = this.configService.get('BACKEND_URL') || 'http://localhost:3001';
    
    if (user.profilePicture && !user.profilePicture.startsWith('http')) {
      user.profilePicture = `${backendUrl}${user.profilePicture}`;
    }
    
    return user;
  }

  private processUsersUrls(users: User[]): User[] {
    return users.map(user => this.processUserUrls(user));
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const processedUser = this.processUserUrls(user);
    
    // Generate token
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    const access_token = this.jwtService.sign(payload);
    
    return {
      user: processedUser,
      access_token
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    return this.processUsersUrls(users);
  }

  @UseGuards(JwtAuthGuard)
  @Get('professionals')
  async findProfessionals(@Query() filterDto: FilterUsersDto) {
    const result = await this.usersService.findProfessionals(filterDto);
    return {
      ...result,
      data: this.processUsersUrls(result.data)
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('suppliers')
  async findSuppliers(@Query() filterDto: FilterUsersDto) {
    const result = await this.usersService.findSuppliers(filterDto);
    return {
      ...result,
      data: this.processUsersUrls(result.data)
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('brands')
  async findBrands(): Promise<User[]> {
    const users = await this.usersService.findByRole(UserRole.BRAND);
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