import { IUserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async updatePreferences(userId: string, preferences: Record<string, any>): Promise<User> {
    return this.userRepository.updatePreferences(userId, preferences);
  }

  async getUser(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
}
