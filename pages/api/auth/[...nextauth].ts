import nextauth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { userData } from "@/data/index.ts";

export default nextauth({
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "xxmistacruzxx",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (credentials === undefined) return null;

        let user;
        try {
          user = await userData.authUser(
            credentials.username,
            credentials.password
          );
        } catch (e) {
          return null;
        }

        return {
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: "test",
  jwt: {
    secret: "test",
  },
});
