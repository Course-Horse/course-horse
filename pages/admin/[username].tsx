import Head from "next/head";
import { useEffect, useState } from "react";
import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import styles from "@/styles/admin.module.scss";
import { Button } from "react-bootstrap";
import { useParams } from "next/navigation";
import axios from "axios";
import { parse } from "marked";
import * as DOMPurify from "dompurify";
import utils from "@/utils";

export default function AdminView({ username }: { username: any }) {
  const { username: usernameQ } = useParams();
  const [data, setData] = useState(null) as any;
  const [loading, setLoading] = useState(true);

  function fetchApplication() {
    setLoading(true);
    // make request
    axios
      .get(`/api/users/${usernameQ}`)
      .then((res) => {
        console.log(res);
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        utils.alertError(alert, err, "Failed to fetch user");
        window.location.href = "/admin";
      });
  }

  function setStatusHandler(e: any) {
    let status = e.target.value;
    // make request
    axios
      .post(`/api/applications/${usernameQ}`, { status })
      .then((res) => {
        console.log(res);
        fetchApplication();
      })
      .catch((err) => {
        utils.alertError(alert, err, "Failed to update application status");
      });
  }

  useEffect(() => {
    // get user info
    fetchApplication();
  }, []);

  return (
    <>
      <Head>
        <title>Admin | Course Horse</title>
        <meta name="description" content="Admin page for Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <h1>{usernameQ}&apos;s Application</h1>
            <div id="application" className={styles.application}>
              <div
                id="applicationDetails"
                className={styles.applicationDetails}
              >
                <img src={data.profilePicture} alt="profile picture" />
                <div>
                  <h2>{data.username}</h2>
                  <p>
                    {data.firstName} {data.lastName}
                  </p>
                  <p>{data.email}</p>
                </div>

                {!data.application ? (
                  <div>
                    <h3>No application available.</h3>
                  </div>
                ) : (
                  <>
                    <div className={styles.applicationContent}>
                      <h3>Application Content</h3>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            parse(data.application.content) as any
                          ) as any,
                        }}
                      ></div>
                    </div>
                    <div>
                      <h3>Additional Documents</h3>
                      <div>
                        {data.application.documents.map(
                          (document: any, index: number) => {
                            return (
                              <a key={index} href={document}>
                                Document {index + 1}
                              </a>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {data.application && (
                <>
                  <p>Current Status: {data.application.status}</p>
                  <div
                    id="applicationActions"
                    className={styles.applicationActions}
                  >
                    <Button
                      variant="success"
                      value={"accepted"}
                      onClick={setStatusHandler}
                    >
                      Accept Application
                    </Button>
                    <Button
                      variant="warning"
                      value={"pending"}
                      onClick={setStatusHandler}
                    >
                      Set to Pending
                    </Button>
                    <Button
                      variant="danger"
                      value={"declined"}
                      onClick={setStatusHandler}
                    >
                      Decline Application
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkAdmin(context);
};
