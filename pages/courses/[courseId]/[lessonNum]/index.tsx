import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";

import styles from "@/styles/lesson.module.scss";
import headerStyles from "@/styles/header.module.scss";
import NavBar from "@/components/navbar/navbar";

function YTEmbed({ link }: { link: string }) {
  return (
    <iframe
      width="400"
      height="300"
      src={link}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
}

export default function Lesson({ username }: { username: string }) {
  const router = useRouter();
  const { courseId, lessonNum } = router.query;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/courses/${courseId}/${lessonNum}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Course | Course Horse</title>
        <meta name="description" content="View a course on Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <>
            <div className={headerStyles.header}>
              <img src={data.coursePicture} />
              <div>
                <h1>{data.courseTitle}</h1>
                <h2>
                  Lesson {lessonNum}: {data.title}
                </h2>
                <p>{data.description}</p>
              </div>
            </div>
            <div className={styles.content}>
              <h3>Lesson Content</h3>
              <div>
                <p>{data.content}</p>
              </div>
            </div>
            {data.videos.length > 0 ? (
              <div className={styles.videos}>
                <h3>Lesson Videos</h3>
                <div>
                  {data.videos.map((link, index) => {
                    return <YTEmbed key={`${index}_${link}`} link={link} />;
                  })}
                </div>
              </div>
            ) : (
              <></>
            )}
            {data.quiz !== null ? (
              <div className={styles.quiz}>
                <h3>Lesson Quiz</h3>
                <div>
                  <p>{data.quiz.description}</p>
                  <Button href={`/courses/${courseId}/${lessonNum}/quiz`}>
                    Start Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </main>
    </>
  );
}

import auth from "@/auth";

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
