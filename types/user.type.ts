export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  avatar: string | null;
  city: string | null;
  description: string | null;
  isTalent: boolean;
  isAnnouncer: boolean;
  isVerify: boolean;

  // Champs pour reset de mot de passe
  passwordResetToken: string | null;
  passwordResetTokenExpiresAt: Date | null;

  // Champs pour vérification d'email
  emailVerificationToken: string | null;
  emailVerificationTokenExpiresAt: Date | null;

  // Champ obligatoire pour l'onboarding
  onboarding: boolean;

  createdAt: Date;
  updatedAt: Date;

  // Sessions associées (optionnel lors du retour)
  sessions?: UserSession[];
}

export interface UserSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string | null;
  token: string;
  isOnline: boolean;
  lastActivityAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegister {
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
  // Retirer session d'ici car c'est une input de login, pas une sortie
}

export interface UserOnboarding {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  city: string;
  description: string;
  isTalent: boolean;
  isAnnouncer: boolean;
}


export interface UserUpdateProfile {
  id: string; 
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string | null;
  city?: string;
  description?: string;
  isTalent?: boolean;
  isAnnouncer?: boolean;
  password?: string;
}