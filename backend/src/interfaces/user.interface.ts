import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IUserRepository {
  create(data: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUserDocument>;
  findById(id: string): Promise<IUserDocument | null>;
  findByEmail(email: string): Promise<IUserDocument | null>;
  findAll(): Promise<IUserDocument[]>;
  update(id: string, data: Partial<IUser>): Promise<IUserDocument | null>;
  delete(id: string): Promise<boolean>;
}
