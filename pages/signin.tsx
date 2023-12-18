import { useRef } from "react";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import { Spinner } from "react-bootstrap";

import NavBar from "@/components/navbar/navbar";
import auth from "@/auth/";
import styles from "@/styles/signin.module.scss";
import validator from "@/data/helpers/validator.js";

export default function Signin({ username }: { username: any }) {
  const [loading, setLoading] = useState(false);
  const usernamei = useRef("");
  const password = useRef("");

  async function submitHandler(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      usernamei.current = validator.checkUsername(
        usernamei.current,
        "username"
      );
      password.current = validator.checkPassword(password.current, "password");
    } catch (e) {
      setLoading(false);
      alert(e);
      return;
    }

    axios
      .post(`/api/signin`, {
        username: usernamei.current,
        password: password.current,
      })
      .then((res) => {
        Router.push("/");
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data) {
          alert(err.response.data.error);
        } else {
          alert("error occurred please try again");
        }
        setLoading(false);
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
      <NavBar username={username} />
      <main className="pageContainer">
        <div className={styles.signinContainer}>
          <h1>Sign in</h1>
          <form onSubmit={submitHandler}>
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                onChange={(e) => (usernamei.current = e.target.value)}
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
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkAuthenticated(context, true, "/profile");
};
