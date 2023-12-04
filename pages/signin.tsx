import { useRef } from "react";
import { signIn } from "next-auth/react";

import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import Head from "next/head";

export default function Signin() {
  const username = useRef("");
  const password = useRef("");

  async function submitHandler(e: any) {
    e.preventDefault();

    const result = await signIn("credentials", {
      username: username.current,
      password: password.current,
      redirect: true,
      callbackUrl: "/profile",
    });
  }

  return (
    <>
      <Head>
        <title>Signin | Course Horse</title>
        <meta
          name="description"
          content="Signin to your Course Horse account."
        />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <h1>Signin</h1>
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="username"
              onChange={(e) => (username.current = e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => (password.current = e.target.value)}
            />
          </div>
          <button type="submit">Signin</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
