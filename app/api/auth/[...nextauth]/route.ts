// app/api/auth/[...nextauth]/route.ts

import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth" 
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ---  Define and EXPORT the auth options separately ---
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
};

// Use the options to create the handler
const handler = NextAuth(authOptions);

// Export the handlers as before
export { handler as GET, handler as POST }

// This part extends the default session type to include the user ID
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}