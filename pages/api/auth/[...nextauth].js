import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Magic } from "@magic-sdk/admin";
import prisma from "lib/prisma";

const magic = new Magic(process.env.MAGIC_SK, {
  testMode: process.env.NODE_ENV !== "production",
});

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
        // change to NODE_ENV for prod
        if (process.env.ENV !== "production") {
          return {
            caseID: "abc123",
            role: "Student",
            avatar: "Gordon Ramsay",
            subscription: "Basic",
            environment: process.env.ENV,
          };
        }

        magic.token.validate(didToken);

        const metadata = await magic.users.getMetadataByToken(didToken);

        return await prisma.user.findUnique({
          where: {
            caseID: metadata.email.split("@")[0],
          },
        });
      },
    }),
    CredentialsProvider({
      id: "signup",
      name: "Magic Link",
      credentials: {
        didToken: { label: "DID Token", type: "text" },
        role: { label: "Role", type: "text", placeholder: "Student" },
        avatar: {
          label: "Avatar",
          type: "text",
          placeholder: "Gordon Ramsay",
        },
      },
      async authorize({ didToken, role, avatar }, _) {
        // change to NODE_ENV for prod
        if (process.env.ENV !== "production") {
          return {
            caseID: "abc123",
            role: "Student",
            avatar: "Gordon Ramsay",
            subscription: "Basic",
            environment: process.env.ENV,
          };
        }

        magic.token.validate(didToken);

        const metadata = await magic.users.getMetadataByToken(didToken);

        return await prisma.user.create({
          data: {
            caseID: metadata.email.split("@")[0],
            role,
            avatar,
          },
        });
      },
    }),
  ],
});
