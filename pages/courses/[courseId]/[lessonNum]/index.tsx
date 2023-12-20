import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";

import styles from "@/styles/lesson.module.scss";
import headerStyles from "@/styles/header.module.scss";
import NavBar from "@/components/navbar/navbar";
import { parse } from "marked";
import * as DOMPurify from "dompurify";

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
  const [data, setData] = useState(null) as any;
  const [viewed, setViewed] = useState(null);

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
        alert(err.response.data.error);
        window.location.href = `/courses/${courseId}`;
      });

    axios
      .get(`/api/courses/${courseId}/${lessonNum}/view`)
      .then((res) => {
        console.log(res.data.viewed);
        setViewed(res.data.viewed);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function toggleViewed() {
    axios
      .post(`/api/courses/${courseId}/${lessonNum}/view`)
      .then((res) => {
        console.log(res.data);
        setViewed(res.data.viewed);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteLesson() {
    axios
      .delete(`/api/courses/${courseId}/${lessonNum}`)
      .then((res) => {
        console.log(res);
        window.location.href = `/courses/${courseId}`;
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
              <div>
                <img src={data.coursePicture} />
                <Link href={`/courses/${courseId}`}>Back to Course</Link>
              </div>

              <div>
                <h1>{data.courseTitle}</h1>
                <h2>
                  Lesson {Number(lessonNum) + 1}: {data.title}
                </h2>
                <p>{data.description}</p>
                {data.creator !== username ? null : (
                  <div>
                    <Button onClick={deleteLesson} variant="danger">
                      Delete Lesson
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.content}>
              <h3>Lesson Content</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(parse(data.content) as any) as any,
                }}
              ></div>
            </div>
            {data.videos.length > 0 ? (
              <div className={styles.videos}>
                <h3>Lesson Videos</h3>
                <div>
                  {data.videos.map((link: string, index: number) => {
                    return <YTEmbed key={`${index}_${link}`} link={link} />;
                  })}
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className={styles.endButtons}>
              {data.creator === username ? null : viewed === null ? (
                <div>
                  <Spinner />
                </div>
              ) : (
                <Button
                  variant={viewed ? "warning" : "primary"}
                  onClick={toggleViewed}
                >
                  {viewed ? "Unmark Lesson as Viewed" : "Mark Lesson as Viewed"}
                </Button>
              )}
              <Button
                variant="secondary"
                href={`/courses/${courseId}/${lessonNum}/discussion`}
              >
                Go to Lesson Discussion
              </Button>
            </div>

            {data.quiz !== null ? (
              <div className={styles.quiz}>
                <h3>Lesson Quiz</h3>
                <div>
                  <p>{data.quiz.description}</p>
                  <Button
                    href={`/courses/${courseId}/${lessonNum}/quiz`}
                    disabled={data.quiz.completed.includes(username)}
                    variant={
                      !data.quiz.completed.includes(username)
                        ? "primary"
                        : "warning"
                    }
                  >
                    {!data.quiz.completed.includes(username)
                      ? "Start Quiz"
                      : "Quiz Completed"}
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
import Link from "next/link";

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
