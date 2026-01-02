import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";

export const config = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials == null) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials?.email },
        });

        if (user && user.password) {
          const isMatch = compareSync(credentials.password, user.password);

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user does not exist or password does not match return null
        return null;
      },
    }),
  ],
  //   callbacks: {
  //     async session({ session, token, user, trigger }) {
  //       // Set the user id from the token
  //       session.user.id = token.sub;

  //       // If there is an update, set the user name
  //       if (trigger === "update") {
  //         session.user.name = user.name;
  //       }
  //       return session;
  //     },
  //   },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
