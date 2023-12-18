import { Html, Head, Main, NextScript } from "next/document";

import auth from "@/auth/";

export default function Document({ username }: { username: any }) {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
