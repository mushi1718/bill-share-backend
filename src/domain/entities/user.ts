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

export interface Workspace {
  id: number;
  userId: string;
  name: string;  // 'life', 'work', or custom
  icon?: string;
  order: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface WorkspaceApp {
  workspaceId: number;
  appId: string;
  order: number;
  createdAt: Date;
  app?: any; // To avoid circular dependency or complex types for now, we'll cast it in repository or import App type. 
             // Ideally: app?: App; but App is defined in app.entity which is infra, or is it in domain?
             // It's not in user.ts. Let's see where App domain is.
}



export interface AuthResponse {
  user: User;
  token: string;
}
