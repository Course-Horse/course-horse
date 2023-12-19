import { useEffect, useState } from "react";
import Head from "next/head";
import $ from "jquery";
import axios from "axios";

import validator from "@/data/helpers/validator.js";
import auth from "@/auth/";
import styles from "@/styles/profile.module.scss";
import { Spinner } from "react-bootstrap";
import NavBar from "@/components/navbar/navbar";
import { useParams } from "next/navigation";

export default function MyProfile({ username }: { username: any }) {
  const { username: thisUsername } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null) as any;

  useEffect(() => {
    axios
      .get(`/api/users/${thisUsername}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data) {
          alert(err.response.data.error);
          window.location.href = "/profile";
        } else {
          alert("error occurred please try again");
        }
      });
  }, []);

  return (
    <>
      <Head>
        <title>My Profile | Course Horse</title>
        <meta name="description" content="View your profile on Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <div className={styles.publicProfile}>
            <img src={data.profilePicture} />
            <h1>{thisUsername}</h1>
            <p>{data.email}</p>
            <p>{`${data.firstName} ${data.lastName}`}</p>
          </div>
        )}
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
