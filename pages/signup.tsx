import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import $ from "jquery";

import styles from "@/styles/signup.module.scss";
import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default function Register() {
  function submitHandler(e: any) {
    e.preventDefault();
    let username = $("#username").val();
    let password = $("#password").val();
    let email = $("#email").val();
    let firstName = $("#firstName").val();
    let lastName = $("#lastName").val();
    let type = $("#type").val();

    axios
      .post("/api/users", {
        username: username,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName,
        type: type,
      })
      .then((res) => {
        console.log(res);
        window.location.href = "/signin";
      })
      .catch((err) => {
        alert(err);
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
            <div>
              <label htmlFor="type">I am a...</label>
              <select name="type" id="type">
                <option value="learner">Learner</option>
                <option value="educator">Educator</option>
              </select>
            </div>
            <button type="submit">Sign Up</button>
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
