import { UserRepository } from "@/src/lib/repositories/User.repo";
import crypto from "node:crypto";
import {
  UserRegister,
  UserRegisterResult,
  UserLoginRecord,
  UserProfile,
  UserVerifyCodeResult,
  UserResendVerificationCodeResult,
  CreateUserPublicSite,
  CreateUserPublicSiteResult,
  SerializedUser,
} from "../dtos/Users.dto";
import { UserType } from "../enums/user.enum";
import { User } from "../entities/User.entity";

export class UserService {

  static serializeUser(user: User | UserProfile): SerializedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name || "",
      userType: user.userType,
      nameInitials: user.name?.split(" ").map((name) => name[0]).slice(0, 2).join("").toUpperCase() || "",
    };
  }

  static async getUserProfile(email: string): Promise<UserProfile | null> {
    const user = await UserRepository.findOneBy({ email }, [
      "id",
      "email",
      "name",
      "userType",
      "isVerified",
    ]);
    if (!user) return null;
    const { passwordHash: _, ...profile } = user;
    return profile as UserProfile;
  }

  static async getLoginUser(email: string): Promise<UserLoginRecord | null> {
    const user = await UserRepository.findOneBy(
      { email, userType: UserType.PROVIDER },
      ["id", "email", "name", "userType", "isVerified", "passwordHash"],
    );
    return user as UserLoginRecord;
  }

  static async createUserFromPublicSite(
    data: CreateUserPublicSite,
  ): Promise<CreateUserPublicSiteResult> {
    const existingUsers = await UserRepository.findBy({ email: data.email }, [
      "id",
      "userType",
    ]);

    const user = existingUsers?.find((u) => u.userType === UserType.CUSTOMER);

    if (user) {
      return { id: user.id };
    }

    return UserRepository.createUser({
      ...data,
      passwordHash: "",
      userType: UserType.CUSTOMER,
    });
  }

  private static generateVerificationCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  static async registerUser(data: UserRegister): Promise<UserRegisterResult> {
    const existingUser = await UserRepository.findOneBy({ email: data.email }, [
      "id",
      "email",
      "isVerified",
      "userType",
    ]);

    if (existingUser?.isVerified && existingUser.userType === UserType.PROVIDER) {
      throw new Error("El usuario ya existe");
    }

    const passwordHash = crypto
      .createHash("sha512")
      .update(data.password)
      .digest("hex");

    const verificationCode = await this.generateVerificationCode();
    const signupHash = crypto.randomBytes(64).toString("hex");

    if (existingUser) {
      await UserRepository.updateUser(existingUser.id, {
        verificationCode,
        signupHash,
        passwordHash,
      });
      return { signupHash };
    }

    const newUser = await UserRepository.createUser({
      email: data.email,
      name: data.name,
      passwordHash,
      verificationCode,
      signupHash,
      userType: UserType.PROVIDER,
      isVerified: false,
    });

    if (!newUser) {
      throw new Error("Error al registrar el usuario");
    }

    return { signupHash };
  }

  static async verifyCode(
    signupHash: string,
    code: string,
  ): Promise<UserVerifyCodeResult> {
    const user = await UserRepository.findOneBy(
      { signupHash, verificationCode: code },
      ["id"],
    );

    if (!user) {
      return { isCodeValid: false };
    }

    await UserRepository.updateUser(user.id, {
      isVerified: true,
      verificationCode: null,
      signupHash: null,
    });

    return { isCodeValid: true };
  }

  static async validateSignupHash(signupHash: string) {
    const user = await UserRepository.findOneBy({ signupHash }, ["id"]);
    if (!user) {
      return null;
    }
    return user;
  }

  static async resendVerificationCode(
    signupHash: string,
  ): Promise<UserResendVerificationCodeResult> {
    const user = await this.validateSignupHash(signupHash);
    if (!user) {
      return { codeSent: false };
    }
    const verificationCode = this.generateVerificationCode();
    await UserRepository.updateUser(user.id, {
      verificationCode,
    });
    return { codeSent: true };
  }
}
