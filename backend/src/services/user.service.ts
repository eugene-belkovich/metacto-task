import { injectable, inject } from 'inversify';
import { TYPES } from '../types/di.types';
import { IUserRepository, IUserDocument } from '../interfaces/user.interface';
import { NotFoundError } from '../errors';

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserService {
  findById(id: string): Promise<UserResponse>;
  findByEmail(email: string): Promise<UserResponse>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async findById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.serializeUser(user);
  }

  async findByEmail(email: string): Promise<UserResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.serializeUser(user);
  }

  private serializeUser(user: IUserDocument): UserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
