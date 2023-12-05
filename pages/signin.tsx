import { useRef } from "react";
import { signIn, getSession } from "next-auth/react";
import Head from "next/head";

import styles from "@/styles/signin.module.scss";
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import Link from "next/link";

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
        <div className={styles.signinContainer}>
          <h1>Sign in</h1>
          <form onSubmit={submitHandler}>
            <div>
              <label htmlFor="username">Username</label>
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
            <button type="submit">Sign in</button>
            <Link href="/signup">Don't have an account? Sign up here!</Link>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
