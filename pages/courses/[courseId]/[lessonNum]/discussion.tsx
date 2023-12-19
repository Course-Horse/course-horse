import Head from "next/head";
import auth from "@/auth";
import NavBar from "@/components/navbar/navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import verticalFormStyles from "@/styles/verticalForm.module.scss";
import styles from "@/styles/discussion.module.scss";

export default function Discussion({ username }: { username: any }) {
  const router = useRouter();
  const { courseId, lessonNum } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null) as any;

  useEffect(() => {
    axios
      .get(`/api/courses/${courseId}/${lessonNum}/discussion`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.error);
        window.location.href = `/courses/${courseId}`;
      });
  }, []);

  function submitMessage(e: any) {
    e.preventDefault();
    const message = e.target.newMessage.value;
    axios
      .post(`/api/courses/${courseId}/${lessonNum}/discussion`, {
        message: message,
      })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <Head>
        <title>Discussion | Course Horse</title>
        <meta name="description" content="Discussion" />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <>
            <h1>Discussion</h1>
            <form className={verticalFormStyles.form} onSubmit={submitMessage}>
              <h2>Post a Message</h2>
              <div>
                <label htmlFor="newMessage">Your New Message</label>
                <textarea id="newMessage" placeholder="Message"></textarea>
              </div>
              <div>
                <label htmlFor="submitMessage">Post Message</label>
                <input id="submitMessage" type="submit" value="Submit" />
              </div>
            </form>
            <div>
              <h2>Messages</h2>
              {data.discussion.length === 0 ? (
                <p>No Messages</p>
              ) : (
                <div className={styles.messages}>
                  {data.discussion
                    .reverse()
                    .map((message: any, index: number) => {
                      return (
                        <div key={index} className={styles.message}>
                          <div>
                            <p>{message.username}</p>
                            <p>{new Date(message.created).toString()}</p>
                          </div>
                          <p>{message.message}</p>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps(context: any) {
  return await auth.checkAuthenticated(context);
}
