import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import fetchAPI from "strapi/fetch";

const options: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  database: process.env.DATABASE_URL,
  session: {
    jwt: true,
  },

  callbacks: {
    async jwt({ token, account }) {
      const isSignIn = account ? true : false;
      if (isSignIn) {
        const response = await fetchAPI(
          `/auth/${account.provider}/callback?access_token=${account?.access_token}`,
      
        );
        token.jwt = response.jwt;
        token.id = response.user.id;
      }
      return Promise.resolve(token);
    },

    async session({ session, user, token }) {
      session.jwt = token.jwt
      session.id = token.id
      
      return session
    },
  },
};

const Auth = (req: any, res: any) => NextAuth(req, res, options);

export default Auth;
