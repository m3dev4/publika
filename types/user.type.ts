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
}

export interface UserSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegister {
  email: string;
  password: string;
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