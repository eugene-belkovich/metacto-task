import { injectable, inject } from 'inversify';
import jwt from 'jsonwebtoken';
import { TYPES } from '../types/di.types';
import { IUserRepository, IUserDocument } from '../interfaces/user.interface';
import { hashPassword, comparePassword, validatePassword } from '../utils/password';
import { env } from '../config';
import { ValidationError, UnauthorizedError } from '../errors';

export interface IAuthService {
  register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: AuthUserResponse; token: string }>;
  login(email: string, password: string): Promise<{ user: AuthUserResponse; token: string }>;
  verifyToken(token: string): Promise<TokenPayload>;
  generateToken(user: IUserDocument): string;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: AuthUserResponse; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError('Email already registered', { field: 'email' });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new ValidationError('Password validation failed', {
        errors: passwordValidation.errors,
      });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await this.userRepository.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    });

    const token = this.generateToken(user);

    return {
      user: this.serializeUser(user),
      token,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: AuthUserResponse; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user);

    return {
      user: this.serializeUser(user),
      token,
    };
  }

  generateToken(user: IUserDocument): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token');
      }
      throw new UnauthorizedError('Token verification failed');
    }
  }

  private serializeUser(user: IUserDocument): AuthUserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
