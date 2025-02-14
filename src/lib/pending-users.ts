import { db } from '@/lib/db/db';
import { v4 as uuidv4 } from 'uuid';

export async function createPendingUser(userData: {
  email: string;
  password: string;
  fullName: string;
}) {
  const token = uuidv4();
  
  await db.user.create({
    data: {
      email: userData.email.toLowerCase(),
      password: userData.password,
      fullName: userData.fullName,
      verifyCode: token,
      verifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      emailVerified: null // null means unverified
    }
  });

  return token;
}

export async function getPendingUserByToken(token: string) {
  return db.user.findFirst({
    where: { 
      verifyCode: token,
      emailVerified: null
    }
  });
}

export async function deletePendingUser(email: string) {
  await db.user.delete({
    where: { 
      email: email.toLowerCase(),
      emailVerified: null
    }
  });
}