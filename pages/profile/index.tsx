import { useEffect, useState } from "react";
import Head from "next/head";
import $ from "jquery";
import axios from "axios";

import utils from "@/utils";
import validator from "@/data/helpers/validator.js";
import auth from "@/auth/";
import styles from "@/styles/profile.module.scss";
import { Spinner } from "react-bootstrap";
import NavBar from "@/components/navbar/navbar";
import Link from "next/link";

export default function MyProfile({ username }: { username: any }) {
  const [loading, setLoading] = useState(true);
  const [loadingPic, setLoadingPic] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [data, setData] = useState(null) as any;

  useEffect(() => {
    // get user data to populate profile page
    axios
      .get(`/api/users/`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        utils.alertError(alert, err, "Error getting your user data.");
        window.location.href = "/";
      });
  }, []);

  function changeProfilePicture() {
    setLoadingPic(true);
    // get user inputs
    let profilePicture = $("#profilePicture")[0] as any;
    if (!profilePicture.files || !profilePicture.files[0]) {
      alert("You must provide a course image!");
      setLoadingPic(false);
      return;
    }
    let reader = new FileReader();
    reader.onload = function () {
      // validate user inputs
      profilePicture = reader.result;
      try {
        profilePicture = validator.checkImage(
          profilePicture,
          "Profile Picture"
        );
      } catch (e) {
        alert(e);
        setLoadingPic(false);
        return;
      }

      // make request
      axios
        .post(`/api/users/${username}`, {
          updateType: "picture",
          profilePicture,
        })
        .then((res) => {
          console.log(res);
          setData(res.data);
          setLoadingPic(false);
        })
        .catch((err: any) => {
          utils.alertError(
            alert,
            err,
            "Error updating your profile picture. Please try again."
          );
          setLoadingPic(false);
        });
    };
    reader.readAsDataURL(profilePicture.files[0]);
  }

  function submitPersonal() {
    setLoadingPersonal(true);
    // get and validate user inputs
    let firstName, lastName, email, bio;
    try {
      firstName = validator.checkName($("#firstName").val(), "first name");
      lastName = validator.checkName($("#lastName").val(), "last name");
      email = validator.checkEmail($("#email").val(), "email");
      bio = $("#bio").val() as any;
      if (bio.trim() !== "") bio = validator.checkString(bio, "bio");
      else bio = undefined;
    } catch (e) {
      alert(e);
      setLoadingPersonal(false);
      return;
    }

    // make request
    axios
      .post(`/api/users/${username}`, {
        updateType: "personal",
        firstName,
        lastName,
        email,
        bio,
      })
      .then((res) => {
        console.log(res);
        setData(res.data);
        setLoadingPersonal(false);
      })
      .catch((err) => {
        utils.alertError(
          alert,
          err,
          "Error updating your personal info. Please try again."
        );
        setLoadingPersonal(false);
      });
  }

  function submitPassword() {
    setLoadingPassword(true);
    // GET INPUTS AND CLIENT SIDE VALIDATE
    let password, confirmPassword;
    try {
      password = validator.checkPassword($("#password").val(), "password");
      confirmPassword = validator.checkPassword(
        $("#confirmPassword").val(),
        "confirm password"
      );
      if (password !== confirmPassword) throw "Passwords do not match";
    } catch (e) {
      alert(e);
      setLoadingPassword(false);
      return;
    }

    // MAKE REQUEST
    axios
      .post(`/api/users/${username}`, {
        updateType: "password",
        password,
      })
      .then((res) => {
        setData(res.data);
        setLoadingPassword(false);
        alert("Successfully changed password!");
        $("#password").val("");
        $("#confirmPassword").val("");
      })
      .catch((err) => {
        utils.alertError(
          alert,
          err,
          "Error updating your password. Please try again."
        );
        setLoadingPassword(false);
      });
  }

  async function signout() {
    axios
      .get(`/api/signout/`)
      .then((res) => {
        console.log(res);
        window.location.href = "/";
      })
      .catch((err) => {
        utils.alertError(alert, err, "Error signing out. Please try again.");
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
        <h1>My Profile</h1>
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <>
            <div className={styles.profile}>
              <div>
                <img src={data.profilePicture} alt="Your Profile Picture" />
                <form onSubmit={utils.createHandler(changeProfilePicture)}>
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                  />
                  <p>1MB Limit</p>
                  <label htmlFor="submitPicture">Change Profile Picture</label>
                  <input
                    id="submitPicture"
                    type="submit"
                    value="Upload"
                    disabled={loadingPic}
                  />
                  {loadingPic ? (
                    <Spinner style={{ alignSelf: "center" }} />
                  ) : null}
                </form>
              </div>
              <div>
                <h2>{data.username}</h2>
                <form onSubmit={utils.createHandler(submitPersonal)}>
                  <h3>Personal Information</h3>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    defaultValue={data.firstName}
                  />
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    defaultValue={data.lastName}
                  />
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" defaultValue={data.email} />
                  <label htmlFor="bio">Bio</label>
                  <textarea id="bio" defaultValue={data.bio} />
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
                <form onSubmit={utils.createHandler(submitPassword)}>
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
            {data.admin && (
              <Link href={`/admin`}>Go to Application Portal</Link>
            )}
          </>
        )}

        <button onClick={utils.createHandler(signout)}>Sign Out</button>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
