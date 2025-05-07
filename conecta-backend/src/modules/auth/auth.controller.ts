import { Controller, Post, Body, UseGuards, Req, Get, Res, All } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerData) {
    return this.authService.register(registerData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const user = await this.usersService.findOne(req.user.id);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req, @Res() res: Response) {
    const { access_token } = await this.authService.login(req.user);
    
    return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${access_token}`);
  }

  @All('api/auth/callback/google')
  async googleLoginRedirect(@Req() req, @Res() res: Response) {
    const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
    return res.redirect(`/auth/google/callback${queryString ? '?' + queryString : ''}`);
  }
} 