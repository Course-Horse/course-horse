import { useRouter } from "next/router";
import Head from "next/head";
import { Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import utils from "@/utils";
import headerStyle from "@/styles/header.module.scss";
import styles from "@/styles/course.module.scss";
import NavBar from "@/components/navbar/navbar";

function LessonPreview({
  courseId,
  num,
  data,
  username,
}: {
  courseId: any;
  num: number;
  data: any;
  username: string;
}) {
  return (
    <div>
      <h3>
        Lesson {num + 1}: {data.title}
      </h3>
      {data.creator !== username && (
        <p style={{ margin: "0px" }}>
          {data.viewed.includes(username) &&
          (data.quiz === null || data.quiz.completed.includes(username))
            ? "✅ Completed"
            : "❌ Incomplete"}
        </p>
      )}

      <p>{data.description}</p>
      <div>
        <Button href={`/courses/${courseId}/${num}`}>
          Go to Lesson Content
        </Button>
        {data.quiz !== null ? (
          <Button variant="secondary" href={`/courses/${courseId}/${num}/quiz`}>
            Go to Lesson Quiz
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default function Course({ username }: { username: any }) {
  const router = useRouter();
  const { courseId } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null) as any;
  const [enrolled, setEnrolled] = useState(null);

  useEffect(() => {
    // get course data
    axios
      .get(`/api/courses/${courseId}`)
      .then((res) => {
        console.log(res);
        setData(res.data);
        setLoading(false);
        // get enrollment status
        axios
          .get(`/api/courses/${courseId}/enroll`)
          .then((res) => {
            console.log(res);
            setEnrolled(res.data.enrolled);
          })
          .catch((err) => {
            utils.alertError(
              alert,
              err,
              "Unable to load course enrollment status."
            );
          });
      })
      .catch((err) => {
        utils.alertError(alert, err, "Unable to load course.");
        window.location.href = "/courses";
      });
  }, [enrolled]);

  function deleteCourse() {
    axios
      .delete(`/api/courses/${courseId}`)
      .then((res) => {
        alert("Course deleted.");
        window.location.href = "/courses";
      })
      .catch((err) => {
        utils.alertError(alert, err, "Unable to delete course.");
      });
  }

  function toggleEnroll() {
    axios
      .post(`/api/courses/${courseId}/enroll`)
      .then((res) => {
        console.log(res.data.enrolled);
        setEnrolled(res.data.enrolled);
      })
      .catch((err) => {
        utils.alertError(alert, err, "Unable to toggle enrollment in course.");
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
            <div className={headerStyle.header}>
              <div>
                <img src={data.coursePicture} />
                <Link href={`/courses/`}>Back to Courses</Link>
              </div>

              <div>
                <h1>{data.title} </h1>
                <p>Created by {data.creator}</p>
                <p>Tags: {data.tags.join(", ")}</p>
                <p>{data.description}</p>

                {data.creator !== username ? null : (
                  <div>
                    <Button
                      variant="secondary"
                      href={`/courses/${courseId}/edit`}
                    >
                      Edit Course
                    </Button>
                    <Button onClick={deleteCourse} variant="danger">
                      Delete Course
                    </Button>
                  </div>
                )}
                {data.creator === username ? null : enrolled === null ? (
                  <Spinner />
                ) : (
                  <Button
                    onClick={toggleEnroll}
                    variant={enrolled ? "danger" : "primary"}
                  >
                    {enrolled ? "Unenroll" : "Enroll"}
                  </Button>
                )}
              </div>
              {data.completed ? <p>✅ Completed!</p> : null}
            </div>
            <div className={styles.lessonList}>
              <section>
                <h2>Lessons </h2>
                {data.creator !== username ? null : (
                  <div>
                    <Button href={`/courses/${courseId}/create`}>
                      Create Lesson
                    </Button>
                    <Button
                      href={`/courses/${courseId}/reorder`}
                      variant="secondary"
                    >
                      Reorder Lessons
                    </Button>
                  </div>
                )}
              </section>

              <div>
                {data.lessons === undefined ? (
                  <p>You must be enrolled to view lessons.</p>
                ) : data.lessons.length === 0 ? (
                  <p>No Lessons Available</p>
                ) : (
                  data.lessons.map((lesson: any, index: number) => {
                    return (
                      <LessonPreview
                        key={index}
                        courseId={courseId}
                        num={index}
                        data={lesson}
                        username={username}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

import auth from "@/auth/";

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
