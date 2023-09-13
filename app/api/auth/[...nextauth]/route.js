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

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
