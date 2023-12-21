import Head from "next/head";
import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import utils from "@/utils";
import { Button, Spinner } from "react-bootstrap";
import headerStyle from "@/styles/header.module.scss";
import styles from "@/styles/course.module.scss";

export default function Reorder({ username }: { username: any }) {
  const router = useRouter();
  const { courseId } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null) as any;

  function changeOrder(_id: any, direction: any) {
    console.log(_id, direction);
    const index = data.findIndex((lesson: any) => lesson._id === _id);
    let newData = [...data];
    const temp = data[index];
    try {
      if (direction === "up") {
        if (index === 0) return;
        newData[index] = newData[index - 1];
        newData[index - 1] = temp;
      } else {
        if (index === data.length - 1) return;
        newData[index] = newData[index + 1];
        newData[index + 1] = temp;
      }
    } catch (e) {
      console.log(e);
    }
    setData(newData);
  }

  function sendReorder() {
    let lessonIds = data.map((lesson: any) => lesson._id);
    axios
      .post(`/api/courses/${courseId}/rearrange`, {
        lessons: lessonIds,
      })
      .then((res) => {
        console.log(res);
        alert("Successfully reordered lessons");
        window.location.href = `/courses/${courseId}`;
      })
      .catch((err) => {
        utils.alertError(
          alert,
          err,
          "Failed to reorder lessons. Please try again."
        );
      });
  }

  useEffect(() => {
    // get course data
    axios
      .get(`/api/courses/${courseId}`)
      .then((res) => {
        console.log(res);
        if (res.data.creator !== username) {
          utils.alertError(
            alert,
            null,
            "You do not have permission to edit this course"
          );
          window.location.href = `/courses/${courseId}`;
        }
        setData(res.data.lessons);
        setLoading(false);
      })
      .catch((err) => {
        utils.alertError(alert, err, "Failed to load course");
        window.location.href = `/courses/`;
      });
  }, []);

  return (
    <>
      <Head>
        <title>Reorder | Course Horse</title>
        <meta name="description" content="Reorder courses on Course Horse" />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <h1>Reorder Lessons</h1>
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <>
            <div className={headerStyle.header}>
              <h2>Lessons</h2>
              <Button onClick={utils.createHandler(sendReorder)}>
                Confirm Changes
              </Button>
            </div>
            <div className={styles.reorder}>
              {data.map((lesson: any, index: number) => {
                return (
                  <div key={index}>
                    <h3>Lesson {index + 1}</h3>
                    <div>
                      <div>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            changeOrder(lesson._id, "up");
                          }}
                        >
                          ⬆
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            changeOrder(lesson._id, "down");
                          }}
                        >
                          ⬇
                        </Button>
                      </div>
                      <div>
                        <h3>{lesson.title}</h3>
                        <p>{lesson.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkEducator(context, false, "/apply");
};
