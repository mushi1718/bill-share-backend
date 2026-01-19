import { AuthResponse } from '../../domain/entities/user';
import { dbUserRepository } from '../../infrastructure/repositories/db-user.repository';

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
        user.firebaseUid = uid;
        // In a real app we should update the user here
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl
        },
        token: 'firebase_session_' + uid
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
