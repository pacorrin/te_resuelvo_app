export interface SerializedUser {
  id: number;
  email: string;
  name: string;
  userType: number;
  nameInitials: string;
}

export interface CreateUserPublicSite {
  email: string;
  name: string;
  phone: string;
}

export interface CreateUserPublicSiteResult {
  id: number;
}

export interface UserRegister {
  email: string;
  name: string;
  password: string;
}
export interface UserRegisterResult {
  signupHash: string;
}

export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  userType: number;
  isVerified: boolean;
}

export interface UserLoginRecord extends UserProfile {
  passwordHash: string;
}

export interface UserVerifyCode {
  signupHash: string;
  code: string;
}

export interface UserVerifyCode {
  signupHash: string;
  code: string;
}

export interface SearchUser {
  id?: number;
  email?: string;
  name?: string;
  userType?: number;
  isVerified?: boolean;
  signupHash?: string;
  verificationCode?: string;
}

export interface UserVerifyCodeResult {
  isCodeValid: boolean;
}

export interface UserResendVerificationCodeResult {
  codeSent: boolean;
}
