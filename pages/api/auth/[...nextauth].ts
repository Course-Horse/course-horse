import nextauth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

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

        if (
          credentials.username === "xxmistacruzxx" &&
          credentials.password === "password"
        ) {
          return {
            id: "1",
            username: "xxmistacruzxx",
            email: "dacruz04@optonline.net",
          };
        }

        return null;
      },

      // callbacks: {
      //   session: (session, token) => {
      //     if (token) {
      //       session.id = token.id;
      //     }
      //     return session;
      //   },
      //   jwt: (token, user) => {
      //     if (user) {
      //       token.id = user.id;
      //     }
      //     return token;
      //   },
      // },
      // secret:
      //   "ofIGoBJCFxSKzoU2bdlj4leZY+W9XVzbsV6jNUgFn0t1cOQqG4KvflAIvROzyFKoh+R4z4rueippql+eGJ9Dyg==",
      // jwt: {
      //   secret:
      //     "ofIGoBJCFxSKzoU2bdlj4leZY+W9XVzbsV6jNUgFn0t1cOQqG4KvflAIvROzyFKoh+R4z4rueippql+eGJ9Dyg==",
      //   encrpytion: true,
      // },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
});
