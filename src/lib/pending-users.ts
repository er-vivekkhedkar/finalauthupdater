import { db } from '@/lib/db/db';
import { v4 as uuidv4 } from 'uuid';

export async function createPendingUser(userData: {
  email: string;
  password: string;
  fullName: string;
}) {
  const token = uuidv4();
  
  // Store in temporary verification table only
  await db.verifyCode.create({
    data: {
      code: token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      user: {
        create: {
          email: userData.email,
          password: userData.password,
          fullName: userData.fullName,
          emailVerified: null // null means unverified
        }
      }
    }
  });

  return token;
}

export async function getPendingUserByToken(token: string) {
  return db.verifyCode.findFirst({
    where: { 
      code: token,
      expires: {
        gt: new Date() // Check if not expired
      },
      user: {
        emailVerified: null
      }
    },
    include: {
      user: true
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