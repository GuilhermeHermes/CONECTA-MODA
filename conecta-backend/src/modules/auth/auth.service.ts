import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/entities/user.entity';

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
        name: profile.name,
        password: Math.random().toString(36).slice(-8), // Generate random password for OAuth users
        roles: [UserRole.DEFAULT]
      });
    }

    return this.login(user);
  }
} 