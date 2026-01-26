import { BillShareDataSource } from '../config/bill-share-data-source';
import { User as UserEntity } from '../database/entities/user.entity';
import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/repositories/user.repository';

export class DbUserRepository implements IUserRepository {
  private repository = BillShareDataSource.getRepository(UserEntity);

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;
    return this.mapToDomain(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ email });
    if (!entity) return null;
    return this.mapToDomain(entity);
  }

  async findRawByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOneBy({ email });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ firebaseUid });
    if (!entity) return null;
    return this.mapToDomain(entity);
  }

  async create(userData: Omit<User, 'id'> & { firebaseUid?: string }): Promise<User> {
    const entity = this.repository.create({
      ...userData,
      isActive: true
    });
    const saved = await this.repository.save(entity);
    return this.mapToDomain(saved);
  }

  async updatePreferences(id: string, preferences: Record<string, any>): Promise<User> {
    // Fetch existing preferences to merge
    const user = await this.repository.findOneBy({ id });
    if (!user) throw new Error('User not found');

    const updatedPreferences = {
      ...user.preferences,
      ...preferences
    };

    await this.repository.update(id, { preferences: updatedPreferences });

    const updatedUser = await this.repository.findOneBy({ id });
    if (!updatedUser) throw new Error('User not found after update'); // Should not happen
    return this.mapToDomain(updatedUser);
  }

  private mapToDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      avatarUrl: entity.avatarUrl,
      isActive: entity.isActive,
      firebaseUid: entity.firebaseUid,
      preferences: entity.preferences,
      isPro: entity.isPro
    };
  }
}

export const dbUserRepository = new DbUserRepository();
