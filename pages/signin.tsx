import { useRef } from "react";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Spinner } from "react-bootstrap";
import Router from "next/router";

import styles from "@/styles/signin.module.scss";
import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import validator from "@/data/helpers/validator.js";

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const username = useRef("");
  const password = useRef("");

  async function submitHandler(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      username.current = validator.checkUsername(username.current, "username");
      password.current = validator.checkPassword(password.current, "password");
    } catch (e) {
      setLoading(false);
      alert(e);
      return;
    }

    const result = await signIn("credentials", {
      username: username.current,
      password: password.current,
      redirect: false,
    }).then((data) => {
      if (data.ok) {
        Router.push("/profile");
      } else {
        setLoading(false);
        alert("Invalid Credentials. Please try again.");
      }
    });
  }

  return (
    <>
      <Head>
        <title>Signin | Course Horse</title>
        <meta
          name="description"
          content="Sign in to your Course Horse account."
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
            <button type="submit" disabled={loading}>
              Sign in
            </button>
            {loading ? <Spinner /> : null}
            <Link href="/signup">
              Don&apos;t have an account? Sign up here!
            </Link>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkAuthenticated(context, true, "/profile");
};
