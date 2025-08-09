export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  avatar: string | null;
  cityId: string | null;
  city?: string | null; // Nom de la ville pour compatibilité
  description: string | null;
  isTalent: boolean;
  isAnnouncer: boolean;
  isVerify: boolean;
  role: UserRole;

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
  regionId: string;
  cityId?: string; // Optionnel si customCity est fourni
  customCity?: string; // Ville personnalisée si non trouvée dans la liste
  city: string; // Nom final de la ville (soit depuis cityId soit customCity)
  description: string;
  isTalent: boolean;
  isAnnouncer: boolean;
}

// Type pour l'utilisateur avec relations Prisma
export interface UserWithRelations {
  id: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  avatar: string | null;
  cityId: string | null;
  city?: {
    id: string;
    name: string;
    longitude: number | null;
    latitude: number | null;
    regionId: string;
    createdAt: Date;
    updatedAt: Date;
    region?: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    };
  } | null;
  description: string | null;
  isTalent: boolean;
  isAnnouncer: boolean;
  isVerify: boolean;
  role: UserRole;
  passwordResetToken: string | null;
  passwordResetTokenExpiresAt: Date | null;
  emailVerificationToken: string | null;
  emailVerificationTokenExpiresAt: Date | null;
  onboarding: boolean;
  createdAt: Date;
  updatedAt: Date;
  sessions?: UserSession[];
}

export interface UserUpdateProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string | null;
  regionId?: string;
  cityId?: string;
  customCity?: string;
  city?: string;
  description?: string;
  isTalent?: boolean;
  isAnnouncer?: boolean;
  password?: string;
}
