import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Magic } from "@magic-sdk/admin";
import prisma from "lib/prisma";

const magic = new Magic(process.env.MAGIC_SK);

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { jwt: true },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      id: "signin",
      name: "Magic Link",
      credentials: {
        didToken: { label: "DID Token", type: "text" },
      },
      async authorize({ didToken }, _) {
        magic.token.validate(didToken);

        const metadata = await magic.users.getMetadataByToken(didToken);

        return await prisma.user.update({
          where: {
            caseID: metadata.email.split("@")[0],
          },
          data: {
            isFirstLogin: false,
          },
        });
      },
    }),
    CredentialsProvider({
      id: "signup",
      name: "Magic Link",
      credentials: {
        didToken: { label: "DID Token", type: "text" },
        fullName: { label: "Full Name", type: "text" },
        userName: { label: "Username", type: "text" },
        avatar: { label: "Avatar", type: "text", placeholder: "Gordon Ramsay" },
      },
      async authorize({ didToken, fullName, userName, avatar }, _) {
        magic.token.validate(didToken);

        const metadata = await magic.users.getMetadataByToken(didToken);

        return await prisma.user.create({
          data: {
            caseID: metadata.email.split("@")[0],
            fullName,
            userName,
            avatar,
          },
        });
      },
    }),
  ],
});
