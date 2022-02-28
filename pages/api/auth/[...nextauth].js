import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "lib/prisma";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account.provider === "google") {
        if (!profile.email_verified || !profile.email.endsWith("@case.edu")) {
          return false;
        }

        const caseId = profile.email.split("@")[0];

        const { subscription, canAnswer, accountCreated, isFirstLogin } =
          await prisma.user.upsert({
            where: { caseId },
            update: { isFirstLogin: false },
            create: { caseId, isFirstLogin: true },
          });

        user.caseId = caseId;
        user.subscription = subscription;
        user.canAnswer = canAnswer;
        user.accountCreated = accountCreated;
        user.isFirstLogin = isFirstLogin;

        delete user.id;

        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        delete token.name;
        delete token.email;
        delete token.picture;

        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: { error: process.env.NEXT_PUBLIC_URL },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
