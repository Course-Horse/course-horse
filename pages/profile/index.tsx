import { useEffect, useState } from "react";
import Head from "next/head";
import $ from "jquery";
import axios from "axios";

import validator from "@/data/helpers/validator.js";
import auth from "@/auth/";
import styles from "@/styles/profile.module.scss";
import { Spinner } from "react-bootstrap";
import NavBar from "@/components/navbar/navbar";

export default function MyProfile({ username }: { username: any }) {
  const [loading, setLoading] = useState(true);
  const [loadingPic, setLoadingPic] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [data, setData] = useState(null) as any;

  useEffect(() => {
    axios
      .get(`/api/users/`)
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
    let profilePicture = $("#profilePicture")[0] as any;
    if (!profilePicture.files || !profilePicture.files[0]) {
      alert("You must provide a course image!");
      return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
      profilePicture = reader.result;
      console.log(profilePicture);

      try {
        profilePicture = validator.checkImage(
          profilePicture,
          "Profile Picture"
        );
      } catch (e) {
        alert(e);
        return;
      }

      axios
        .post(`/api/users/${username}`, {
          updateType: "picture",
          profilePicture,
        })
        .then((res) => {
          console.log(res);
          window.location.href = "/profile/";
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.data) {
            alert(err.response.data.error);
          } else {
            alert("error occurred please try again");
          }
        });
    };
    reader.readAsDataURL(profilePicture.files[0]);
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
      .post(`/api/users/${username}`, {
        updateType: "personal",
        firstName,
        lastName,
        email,
      })
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
      .post(`/api/users/${username}`, {
        updateType: "password",
        password,
      })
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
    axios
      .get(`/api/signout/`)
      .then((res) => {
        window.location.href = "/signin";
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data) {
          alert(err.response.data.error);
        } else {
          alert("error occurred please try again");
        }
      });
  }

  return (
    <>
      <Head>
        <title>My Profile | Course Horse</title>
        <meta name="description" content="View your profile on Course Horse." />
      </Head>
      <NavBar username={username} />
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
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
