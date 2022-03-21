import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "lib/prisma";
import axios from "axios";
import fs from "fs";
import path from "path";

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

        const { name, subscription, canAnswer, accountCreated } =
          await prisma.user.upsert({
            where: { caseId },
            update: {},
            create: {
              caseId,
              name: profile.name,
            },
          });

        user.caseId = caseId;
        user.name = name;
        user.subscription = subscription;
        user.canAnswer = canAnswer;
        user.accountCreated = accountCreated;

        delete user.id;

        const filePath = path.join(
          __dirname,
          "../../../../../public/profile-pics",
          `${caseId}.jpg`
        );
        if (!fs.existsSync(filePath)) {
          const { data } = await axios.get(profile.picture, {
            responseType: "arraybuffer",
          });
          fs.writeFileSync(filePath, Buffer.from(data, "base64"));
        }
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
