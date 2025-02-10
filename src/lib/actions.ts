'use server';

import { schema } from "@/lib/schema";
import db from "@/lib/db/db";
import { executeAction } from "@/lib/executeAction";
import { signIn } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { z } from "zod";

// Move schema to a separate file
const validateProfile = async (data: any) => {
  const profileSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    dob: z.string(),
    gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
    bio: z.string().max(500),
    image: z.string().optional(),
  });
  
  return profileSchema.parse(data);
};

export async function signUp(formData: FormData) {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = schema.parse({ email, password });
      await db.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
          password: validatedData.password,
        },
      });
    },
    successMessage: "Signed up successfully",
  });
}

export async function handleSignIn(formData: FormData) {
  await executeAction({
    actionFn: async () => {
      await signIn("credentials", formData);
    },
  });
}

export async function handleGithubSignIn() {
  await signIn("github");
}

export async function updateProfile(data: any) {
  return executeAction({
    actionFn: async () => {
      const session = await auth();
      if (!session?.user?.email) throw new Error("Not authenticated");

      const validatedData = await validateProfile(data);

      await db.user.update({
        where: { email: session.user.email },
        data: {
          name: validatedData.fullName,
          email: validatedData.email,
          image: validatedData.image,
          profile: {
            upsert: {
              create: {
                dateOfBirth: new Date(validatedData.dob),
                gender: validatedData.gender,
                bio: validatedData.bio,
              },
              update: {
                dateOfBirth: new Date(validatedData.dob),
                gender: validatedData.gender,
                bio: validatedData.bio,
              },
            },
          },
        },
      });
    },
    successMessage: "Profile updated successfully",
  });
}

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: true,
    },
  });

  return user;
}
