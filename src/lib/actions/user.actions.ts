"use server";
import { signIn, signOut } from "@/auth";
import { IUserSignIn } from "@/types";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/db/models/user.model";
import bcrypt from "bcryptjs";

export async function signInWithCredentials(user: IUserSignIn) {
  try {
    const result = await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: false,
    });

    console.log("NextAuth signIn result:", result);
    return result;
  } catch (error) {
    console.error("SignIn error:", error);
    return { error: "Authentication failed", status: "error" };
  }
}

export async function testUserCredentials(user: IUserSignIn) {
  try {
    await connectToDatabase();
    const dbUser = await User.findOne({ email: user.email });

    if (!dbUser) {
      return { error: "User not found", userExists: false };
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      dbUser.password
    );

    return {
      userExists: true,
      passwordValid: isPasswordValid,
      user: {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      },
    };
  } catch (error) {
    console.error("Test credentials error:", error);
    return { error: "Database error", userExists: false };
  }
}

export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });
  redirect(redirectTo.redirect);
};
