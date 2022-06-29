import { User } from '../user/user.entity';

export type AccessTokenPayload = {
  user?: any;
  admin?: any;
  sub: string;
  email?: string;
  phoneNumber?: string;
  name?: string;
  authorization?: any;
  role?: string;
};

export type AuthUser = User;
