export interface User {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  avatar?: string;
  city?: string;
  description?: string;
  isTalent: boolean;
  isAnnouncer: boolean;
  isVerify: boolean;
  passwordResetToken: string;
  passwordResetTokenExpiry: Date;
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
