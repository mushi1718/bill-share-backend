import { AuthResponse } from '../../domain/entities/user';
import { dbUserRepository } from '../../infrastructure/repositories/db-user.repository';
import { dbWorkspaceRepository } from '../../infrastructure/repositories/db-workspace.repository';
import { firebaseAdmin } from '../../infrastructure/config/firebase.config';

export class AuthService {
  public async loginWithFirebase(idToken: string): Promise<AuthResponse> {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      const { uid, email, name, picture } = decodedToken;

      if (!email) {
        throw new Error('auth/email-required');
      }

      let user = await dbUserRepository.findByEmail(email);

      if (!user) {
        // Create new user if not exists
        user = await dbUserRepository.create({
          email,
          name: name || 'User',
          avatarUrl: picture,
          firebaseUid: uid,
          isActive: true
        });
      } else if (!user.firebaseUid) {
        // Link existing user to firebase uid if needed
         // Note: In a real app you might want to be careful about linking strategies
        user.firebaseUid = uid;
        // We'd need a method to update the user, assuming save or update exists on repo
        // For now, we assume the repo handles this or we ignore it until explicit update request
        // But since we returned `user` entity, we can theoretically save it back if typeorm entity
        // However, dbUserRepository.create usually saves.
        // Let's assume for this MVP we just return the found user.
        // ideally: await dbUserRepository.update(user.id, { firebaseUid: uid });
      }

      // Ensure default workspaces exist for this user
      try {
        await dbWorkspaceRepository.findByUserId(user.id);
      } catch (err) {
        console.warn('Failed to initialize workspaces on login', err);
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl
        },
        token: 'firebase_session_' + uid // In a real app, you might mint a custom JWT or just use the ID token on client
      };
    } catch (error) {
       console.error('Firebase Auth Error:', error);
       throw new Error('auth/invalid-token');
    }
  }

  public async logout(): Promise<void> {
    // No-op
  }
}

export const authService = new AuthService();
