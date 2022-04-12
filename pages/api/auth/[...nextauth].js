import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "lib/prisma";
import uploadImage from "utils/uploadImage";

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

        const {
          name,
          subscription,
          accountCreated,
          profileImage,
          isFirstLogin,
        } = await prisma.user.upsert({
          where: { caseId },
          update: {
            isFirstLogin: false,
          },
          create: {
            caseId,
            name: profile.name,
          },
        });

        let secure_url = profileImage;

        if (!secure_url) {
          secure_url = await uploadImage({
            imageToUpload: profile.picture,
            public_id: caseId,
            folder: "profile-images",
          });
          await prisma.user.update({
            where: { caseId },
            data: { profileImage: secure_url },
          });
        }

        user.caseId = caseId;
        user.name = name;
        user.subscription = subscription;
        user.accountCreated = accountCreated;
        user.profileImage = secure_url;
        user.isFirstLogin = isFirstLogin;

        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
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
