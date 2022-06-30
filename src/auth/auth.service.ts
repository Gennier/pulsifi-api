import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordCipher } from '../shared/utils/password-ciper';
import { Auth, LoginDto, RegisterDto } from './auth.dto';
import { AccessTokenPayload, AuthUser } from './auth.type';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserRole } from '../user/user.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly passwordCipher: PasswordCipher,
  ) {}

  async register(input: RegisterDto) {
    const hashedPassword = await this.passwordCipher.hash(input.password);
    Object.assign(input, {
      password: hashedPassword,
      ...(input.role && {
        role: input.role,
      }),
    });

    const user = await this.userRepository.save(input);
    return this.createAccessToken(user);
  }

  async login(input: LoginDto): Promise<Auth> {
    const user = await this.userRepository.findOne({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const isPasswordValid = await this.passwordCipher.check(
      input.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    return this.createAccessToken(user);
  }

  async refreshToken(token: string): Promise<Auth> {
    const jwtPayload: AccessTokenPayload = await this.jwtService.verifyAsync(
      token,
    );
    if (jwtPayload.user) {
      const user = await this.userRepository.findOne({
        where: {
          id: jwtPayload.sub,
        },
      });

      if (!user) {
        throw new UnauthorizedException('INVALID_CREDENTIALS');
      }

      return this.createAccessToken(user);
    }
  }

  async createAccessToken(user: User): Promise<Auth> {
    const expiresIn = Number(process.env.JWT_TOKEN_EXPIRATION_TIME);
    const refreshExpiresIn = Number(
      process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    );

    const payload = await this.buildAccessTokenPayload(user);
    const accessToken = await this.jwtService.signAsync(
      { typ: 'Bearer', ...payload },
      { expiresIn },
    );
    const refreshToken = await this.jwtService.signAsync(
      { typ: 'Refresh', ...payload },
      { expiresIn: refreshExpiresIn },
    );
    const authResponse: Auth = {
      accessToken,
      expiresIn,
      refreshToken,
      refreshExpiresIn,
    };
    return authResponse;
  }

  private async buildAccessTokenPayload(
    user: User,
  ): Promise<AccessTokenPayload> {
    return {
      sub: user.id,
      user: {
        name: user.name,
      },
    };
  }

  async logout() {
    return {
      success: true,
      message: 'Logout successfully!',
    };
  }

  async getAuthUser(id: string): Promise<AuthUser> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
}
