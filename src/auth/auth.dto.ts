import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../user/user.enum';

export class AccessToken {
  @IsString()
  accessToken: string;

  @IsNumber()
  expiresIn: number;

  @IsString()
  refreshToken: string;

  @IsNumber()
  refreshExpiresIn: number;
}

export class Auth extends AccessToken {}

export class RequestOTP {
  @IsBoolean()
  success: boolean;
}

export class StatusResponse {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;
}

export class RegisterDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  role: UserRole;
}

export class LoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class AdminLoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
