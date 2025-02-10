'use server';

import { updateProfile } from "@/lib/actions";

export async function handleProfileUpdate(data: FormData) {
  const profileData = {
    fullName: data.get('fullName') as string,
    email: data.get('email') as string,
    dob: data.get('dob') as string,
    gender: data.get('gender') as string,
    bio: data.get('bio') as string,
    image: data.get('image') as string,
  };
  
  return updateProfile(profileData);
} 