import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import $ from "jquery";
import axios from "axios";

import validator from "@/data/helpers/validator.js";
import auth from "@/auth/";
import styles from "@/styles/profile.module.scss";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { Spinner } from "react-bootstrap";

export default function MyProfile() {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [loadingPic, setLoadingPic] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/users/?method=GET`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data) {
          alert(err.response.data.error);
        } else {
          alert("error occurred please try again");
        }
      });
  }, []);

  async function submitProfilePicture(e: any) {
    e.preventDefault();
    axios.get(`/api/users/${session?.user?.name}`);
  }

  async function submitPersonal(e: any) {
    e.preventDefault();
    setLoadingPersonal(true);
    // GET INPUTS AND CLIENT SIDE VALIDATE
    let firstName = $("#firstName").val();
    let lastName = $("#lastName").val();
    let email = $("#email").val();
    try {
      firstName = validator.checkName(firstName, "first name");
      lastName = validator.checkName(lastName, "last name");
      email = validator.checkEmail(email, "email");
    } catch (e) {
      setLoadingPersonal(false);
      alert(e);
      return;
    }

    // MAKE REQUEST
    axios
      .get(
        `/api/users/${session.user.name}?method=POST&updateType=personal&email=${email}&firstName=${firstName}&lastName=${lastName}`
      )
      .then((res) => {
        window.location.href = "/profile";
      })
      .catch((err) => {
        setLoadingPersonal(false);
        console.log(err);
        if (err.response && err.response.data) alert(err.response.data.error);
        else alert("error occurred please try again");
      });
  }

  async function submitPassword(e: any) {
    e.preventDefault();
    setLoadingPassword(true);
    // GET INPUTS AND CLIENT SIDE VALIDATE
    let password = $("#password").val();
    try {
      password = validator.checkPassword(password, "password");
      let confirmPassword = $("#confirmPassword").val();
      if (password !== confirmPassword) throw "Passwords do not match";
    } catch (e) {
      setLoadingPassword(true);
      alert(e);
      return;
    }

    // MAKE REQUEST
    axios
      .get(
        `/api/users/${session.user.name}?method=POST&updateType=password&password=${password}`
      )
      .then((res) => {
        window.location.href = "/profile";
      })
      .catch((err) => {
        setLoadingPassword(true);
        console.log(err);
        if (err.response && err.response.data) alert(err.response.data.error);
        else alert("error occurred please try again");
      });
  }

  async function signoutHandler(e: any) {
    e.preventDefault();
    const result = await signOut({ callbackUrl: "/" });
  }

  return (
    <>
      <Head>
        <title>My Profile | Course Horse</title>
        <meta name="description" content="View your profile on Course Horse." />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <h1>My Profile {loading ? <Spinner /> : null}</h1>

        {loading ? null : (
          <div className={styles.profile}>
            <div>
              <img src={data.profilePicture} />
              <form onSubmit={submitProfilePicture}>
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                />
                <label htmlFor="submitPicture">Change Profile Picture</label>
                <input id="submitPicture" type="submit" value="Upload" />
                {loadingPic ? (
                  <Spinner style={{ alignSelf: "center" }} />
                ) : null}
              </form>
            </div>
            <div>
              <h2>{data.username}</h2>
              <form onSubmit={submitPersonal}>
                <h3>Personal Information</h3>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  defaultValue={data.firstName}
                />
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" defaultValue={data.lastName} />
                <label htmlFor="email">Email</label>
                <input type="email" id="email" defaultValue={data.email} />
                <label htmlFor="submitInfo">Save Personal Information</label>
                <input
                  id="submitInfo"
                  type="submit"
                  value="Save"
                  disabled={loadingPersonal}
                />
                {loadingPersonal ? (
                  <Spinner style={{ alignSelf: "center" }} />
                ) : null}
              </form>
              <form onSubmit={submitPassword}>
                <h3>Change Password</h3>
                <label htmlFor="password">New Password</label>
                <input type="password" id="password" />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" />
                <label htmlFor="submitInfo">Submit New Password</label>
                <input
                  id="submitInfo"
                  type="submit"
                  value="Submit"
                  disabled={loadingPassword}
                />
                {loadingPassword ? (
                  <Spinner style={{ alignSelf: "center" }} />
                ) : null}
              </form>
            </div>
          </div>
        )}

        <button onClick={signoutHandler}>Sign Out</button>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
