'use server';

import { schema } from "@/lib/schema";
import { db } from "@/server/db";
import { executeAction } from "@/lib/executeAction";
import { signIn } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { z } from "zod";
import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";


// Move schema to a separate file
const validateProfile = async (data: Record<string, unknown>) => {
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
      try {
        const email = formData.get("email");
        const password = formData.get("password");
        
        if (!email || !password) {
          return { success: false, message: "Missing email or password" };
        }

        const validatedData = schema.parse({ email, password });

        const existingUser = await db.user.findUnique({
          where: { email: validatedData.email.toLowerCase() }
        });

        if (existingUser) {
          return { success: false, message: "Email already registered" };
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 12);

        // Create user
        const user = await db.user.create({
          data: {
            email: validatedData.email.toLowerCase(),
            password: hashedPassword,
          },
        });

        return { success: true, message: "Account created successfully" };
      } catch (error) {
        console.error("SignUp error:", error);
        return { 
          success: false, 
          message: "Failed to create account. Please try again." 
        };
      }
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

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Not authenticated");

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const image = formData.get('image') as string;
    const dob = formData.get('dob') as string;
    const gender = formData.get('gender') as string;
    const bio = formData.get('bio') as string;

    if (!fullName || !email) {
      return { success: false, error: "Required fields are missing" };
    }

    const updatedUser = await db.user.update({
      where: { 
        email: session.user.email 
      },
      data: {
        fullName,
        email,
        image,
        profile: {
          upsert: {
            create: {
              dateOfBirth: dob ? new Date(dob) : new Date(),
              gender: gender || 'prefer-not-to-say',
              bio: bio || ''
            },
            update: {
              dateOfBirth: dob ? new Date(dob) : new Date(),
              gender: gender || 'prefer-not-to-say',
              bio: bio || ''
            }
          }
        }
      },
      include: {
        profile: true
      }
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function getUserProfile() {
  try {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await db.user.findUnique({
      where: { 
        email: session.user.email 
      },
      include: {
        profile: true
      }
    });

    return user;
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
}

interface UpdateUserData {
  name?: string;
  email?: string;
  image?: string;
  profile?: {
    upsert?: {
      create: {
        dateOfBirth: Date;
        gender: string;
        bio: string;
      };
      update: {
        dateOfBirth: Date;
        gender: string;
        bio: string;
      };
    };
  };
}

export async function updateUserProfile(data: UpdateUserData): Promise<User> {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authenticated");

  return await db.user.update({
    where: { email: session.user.email },
    data: {
      fullName: data.name,
      email: data.email,
      image: data.image,
      profile: data.profile
    }
  });
}

// Remove unused parameters or prefix with underscore
export async function someFunction(_data: UpdateUserData) {
  // Your logic
}
