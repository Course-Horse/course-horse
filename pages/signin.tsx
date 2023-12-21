import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import $ from "jquery";
import { Spinner } from "react-bootstrap";

import utils from "@/utils";
import NavBar from "@/components/navbar/navbar";
import auth from "@/auth/";
import styles from "@/styles/signin.module.scss";
import validator from "@/data/helpers/validator.js";

export default function Signin({ username }: { username: any }) {
  const [loading, setLoading] = useState(false);

  async function signin() {
    setLoading(true);
    // get and validate user inputs
    let usernamei, password;
    try {
      usernamei = validator.checkUsername($("#username").val(), "username");
      password = validator.checkPassword($("#password").val(), "password");
    } catch (e) {
      alert(e);
      setLoading(false);
      return;
    }
    // submit signin
    axios
      .post(`/api/signin`, {
        username: usernamei,
        password: password,
      })
      .then((res) => {
        console.log(res);
        window.location.href = "/profile";
      })
      .catch((err) => {
        utils.alertError(alert, err, "Failed to sign in. Please try again.");
        setLoading(false);
      });
  }

  return (
    <>
      <Head>
        <title>Sign In | Course Horse</title>
        <meta
          name="description"
          content="Sign in to your Course Horse account."
        />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <div className={styles.signinContainer}>
          <h1>Sign in</h1>
          <form onSubmit={utils.createHandler(signin)}>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" />
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
