import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import $ from "jquery";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import validator from "@/data/helpers/validator.js";

import styles from "@/styles/signup.module.scss";
import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default function Register() {
  const [loading, setLoading] = useState(false);

  function submitHandler(e: any) {
    setLoading(true);
    e.preventDefault();

    let username;
    let password;
    let email;
    let firstName;
    let lastName;
    try {
      username = validator.checkUsername($("#username").val(), "username");
      password = validator.checkPassword($("#password").val(), "password");
      let confirmPassword = $("#confirmPassword").val();
      if (password !== confirmPassword) {
        throw "Passwords do not match";
      }
      email = validator.checkEmail($("#email").val(), "email");
      firstName = validator.checkName($("#firstName").val(), "first name");
      lastName = validator.checkName($("#lastName").val(), "last name");
    } catch (e) {
      alert(e);
      setLoading(false);
      return;
    }

    axios
      .get(
        `/api/users?method=POST&username=${username}&password=${password}&email=${email}&firstName=${firstName}&lastName=${lastName}`
      )
      .then((res) => {
        console.log(res);
        window.location.href = "/signin";
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
        <title>Sign Up | Course Horse</title>
        <meta
          name="description"
          content="Sign up for a Course Horse account."
        />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <div className={styles.signinContainer}>
          <h1>Sign Up</h1>
          <form onSubmit={submitHandler}>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" />
            </div>
            <div className={styles.sideby}>
              <div>
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" />
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" />
              </div>
            </div>
            <button type="submit" disabled={loading}>
              Sign Up
            </button>
            {loading ? <Spinner /> : null}
            <Link href="/signin">Already have an account? Sign in here!</Link>
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
