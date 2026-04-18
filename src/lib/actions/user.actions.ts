"use server";

import { getErrorMessage } from "@/src/lib/utils/error";
import { UserService } from "@/src/lib/services/user.service";
import { auth } from "../auth/auth";
import {
  UserRegister,
  UserRegisterResult,
  UserResendVerificationCodeResult,
  UserVerifyCodeResult,
} from "../dtos/Users.dto";
import { ActionResponse } from "../utils/action-response";

export async function loadUserProfile(email: string) {
  try {
    const user = await UserService.getUserProfile(email);
    return { success: true, data: user };
  } catch (error) {
    console.error("Error loading user profile:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function _registerUser(
  user: UserRegister,
): Promise<ActionResponse<UserRegisterResult>> {
  const email = user.email;
  const name = user.name;
  const password = user.password;

  if (!email || !password || !name) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const user = await UserService.registerUser({ email, name, password });
    return { success: true, data: user };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;

  return session.user;
}

export async function _verifyCode(
  signupHash: string,
  code: string,
): Promise<ActionResponse<UserVerifyCodeResult>> {
  if (!signupHash || !code) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const result = await UserService.verifyCode(signupHash, code);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error verifying code:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function _resendVerificationCode(
  signupHash: string,
): Promise<ActionResponse<UserResendVerificationCodeResult>> {
  if (!signupHash) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const result = await UserService.resendVerificationCode(signupHash);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error resending verification code:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function _validateSignupHash(signupHash: string) {
  try {
    const user = await UserService.validateSignupHash(signupHash);
    return { success: true, data: { validHash: !!user } };
  } catch (error) {
    console.error("Error validating signup hash:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}
