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
          role:credentials.role
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
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.jwt;
        token.role = user.role
      }

      return token;
    },
    async session({ session, token, user }) {
     
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.accessTokenExpires = token.accessTokenExpires;
      session.user.role = token.role

      return session;
    },
  },
  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
  generateSessionToken: () => {
    return randomUUID?.() ?? randomBytes(32).toString("hex");
  },
});

export { handler as GET, handler as POST };
