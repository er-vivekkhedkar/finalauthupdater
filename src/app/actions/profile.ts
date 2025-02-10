'use server';

import { updateProfile } from "@/lib/actions";

export async function handleProfileUpdate(profileData: {
  fullName: string;
  email: string;
  dob: string;
  gender: string;
  bio: string;
  image: string;
}) {
  const formData = new FormData();
  
  formData.append('fullName', profileData.fullName);
  formData.append('email', profileData.email);
  formData.append('dob', profileData.dob);
  formData.append('gender', profileData.gender);
  formData.append('bio', profileData.bio);
  formData.append('image', profileData.image);

  return updateProfile(formData);
} 