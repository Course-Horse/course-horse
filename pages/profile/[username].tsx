import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";

import utils from "@/utils";
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
        utils.alertError(alert, err, "Error getting user data.");
        window.location.href = "/profile";
      });
  }, []);

  return (
    <>
      <Head>
        <title>Profile | Course Horse</title>
        <meta name="description" content="View a profile on Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <div className={styles.publicProfile}>
            <img src={data.profilePicture} alt="Profile Picture" />
            <h1>{thisUsername}</h1>
            <p>{data.email}</p>
            <p>{`${data.firstName} ${data.lastName}`}</p>
            <p>{data.bio}</p>
            {data.application && data.application.status === "accepted" && (
              <>
                <h2>Educator Documents</h2>
                {data.application.documents.map((doc: any, index: number) => {
                  return <a href={doc}>Document {index + 1}</a>;
                })}
              </>
            )}
          </div>
        )}
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
