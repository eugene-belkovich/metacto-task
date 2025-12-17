import { injectable } from 'inversify';
import { UserModel } from '../models/user.model';
import { IUserDocument, IUserRepository, IUser } from '../interfaces/user.interface';

@injectable()
export class UserRepository implements IUserRepository {
  async create(data: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUserDocument> {
    const user = new UserModel(data);
    return user.save();
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();
  }

  async findAll(): Promise<IUserDocument[]> {
    return UserModel.find().exec();
  }

  async update(id: string, data: Partial<IUser>): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
