import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public, User as CurrentUser } from '../shared/decorators';
import { User } from '../user/user.entity';
import { AccessToken, LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() input: RegisterDto): Promise<AccessToken> {
    return await this.service.register(input);
  }

  @Public()
  @Post('login')
  async login(@Body() input: LoginDto): Promise<AccessToken> {
    return await this.service.login(input);
  }

  @Get('me')
  async createJob(@CurrentUser() user: User) {
    console.log(user);
    return user;
  }
}
