export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isActive?: boolean;
  firebaseUid?: string;
  preferences?: {
    allowMove?: boolean;
    theme?: string;
    language?: string;
  };
  isPro?: boolean;
}





export interface AuthResponse {
  user: User;
  token: string;
}
