import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {},
      async authorize(credentials, req) {
        const user = {
          email: credentials.email,
          customerId: credentials.customerId,
          channel_id: 1,
        };

        return user;

        /* const result = await axios.post("api/users", user);

        if (result.data.is_valid === true) {
          const response = {
            email: req.email,
            customerId: result.data.customerId,
            channel_id: 1,
          };
          console.log("Login Result", response);
          return response;
        } else {
          console.log("Erro Result");
          return null;
        }*/
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.jwt;
      }

      return token;
    },
    async session({ session, token, user }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.accessTokenExpires = token.accessTokenExpires;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
});

export { handler as GET, handler as POST };
