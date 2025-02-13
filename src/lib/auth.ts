// import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { db } from "@/server/db";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import jwt from 'jsonwebtoken';

// interface ExtendedUser {
//   id: string;
//   email: string | null;
//   accessToken?: string;
//   refreshToken?: string;
// }

// interface ExtendedSession extends Session {
//   accessToken?: string;
//   user: {
//     id: string;
//     email: string;
//   };
// }

// interface ExtendedJWT extends JWT {
//   accessToken?: string;
//   refreshToken?: string;
// }

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>>, req: Request) {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          
          const user = await db.user.findUnique({
            where: { email: credentials.email.toString().toLowerCase() }
          });

          if (!user?.password) return null;

          const passwordMatch = await bcrypt.compare(
            credentials.password.toString(),
            user.password
          );

          if (passwordMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out',
    error: '/error',
  },
});
