// import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { db } from "@/server/db";
// import { Session } from "next-auth";
// import { JWT } from "next-auth/jwt";
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
              name: user.fullName,
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
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Sign in attempt:", { user, account, profile }); // Debug log
      if (account?.provider === "github") {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true }
          });

          if (existingUser) {
            // Link the GitHub account to the existing user if not already linked
            if (!existingUser.accounts.some(acc => acc.provider === "github")) {
              await db.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                }
              });
            }
            return true;
          }

          // Create new user if doesn't exist
          await db.user.create({
            data: {
              email: user.email!,
              fullName: user.name ?? "",
              image: user.image ?? "",
              password: await bcrypt.hash(Math.random().toString(36), 10),
              emailVerified: new Date(),
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                }
              }
            }
          });
        } catch (error) {
          console.error("GitHub sign in error:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      console.log("Session callback:", { session, token }); // Debug log
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      console.log("JWT callback:", { token, account, profile }); // Debug log
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    }
  },
  debug: true, // Enable debug logs
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out',
    error: '/error',
  },
});
