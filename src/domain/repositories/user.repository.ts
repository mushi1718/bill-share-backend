import { User } from '../entities/user';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;

  create(user: Omit<User, 'id'> & { password?: string }): Promise<User>;
  updatePreferences(id: string, preferences: Record<string, any>): Promise<User>;
}
