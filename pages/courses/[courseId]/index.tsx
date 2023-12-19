import { useRouter } from "next/router";
import Head from "next/head";
import { Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

import headerStyle from "@/styles/header.module.scss";
import styles from "@/styles/course.module.scss";
import NavBar from "@/components/navbar/navbar";

function LessonPreview({
  courseId,
  num,
  data,
}: {
  courseId: string;
  num: number;
  data: any;
}) {
  return (
    <div>
      <h3>
        Lesson {num}: {data.title}
      </h3>
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
  const [data, setData] = useState(null);

  useEffect(() => {
    if (courseId) {
      axios
        .get(`/api/courses/${courseId}`)
        .then((res) => {
          console.log(res);
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          alert("Unable to load course.");
          window.location.href = "/courses";
        });
    }
  }, []);

  function deleteCourse() {
    axios
      .delete(`/api/courses/${courseId}`)
      .then((res) => {
        alert("Course deleted.");
        window.location.href = "/courses";
      })
      .catch((err) => {
        console.log(err);
        alert("Unable to delete course.");
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
              <img src={data.coursePicture} />
              <div>
                <h1>{data.title} </h1>
                <p>Tags: {data.tags.join(", ")}</p>
                <p>{data.description}</p>
                {data.creator !== username ? null : (
                  <Button onClick={deleteCourse} variant="danger">
                    Delete Course
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.lessonList}>
              <h2>
                Lessons{" "}
                {data.creator !== username ? null : (
                  <Button href={`/courses/${courseId}/create`}>
                    Create Lesson
                  </Button>
                )}
              </h2>

              <div>
                {data.lessons.length === 0 ? (
                  <h3>No Lessons Available</h3>
                ) : (
                  data.lessons.map((lesson, index) => {
                    return (
                      <LessonPreview
                        key={index}
                        courseId={courseId}
                        num={index}
                        data={lesson}
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
