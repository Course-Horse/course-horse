import NavBar from "@/components/navbar/navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import auth from "@/auth/";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";
import styles from "@/styles/quiz.module.scss";
import utils from "@/utils";
import Head from "next/head";

export default function Quiz({ username }: { username: any }) {
  const router = useRouter();
  const { courseId, lessonNum } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null) as any;

  useEffect(() => {
    // get lesson data for quiz
    axios
      .get(`/api/courses/${courseId}/${lessonNum}`)
      .then((res) => {
        console.log(res.data);
        // redirect if there's no quiz
        if (!res.data.quiz) {
          alert("This lesson has no quiz");
          window.location.href = `/courses/${courseId}/${lessonNum}`;
        }
        if (res.data.quiz.completed.includes(username)) {
          alert("You have already completed this quiz");
          window.location.href = `/courses/${courseId}/${lessonNum}`;
        }
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        utils.alertError(alert, err, "Failed to load quiz");
        window.location.href = `/courses/${courseId}/${lessonNum}`;
      });
  }, []);

  function submitQuiz() {
    // get answers
    let answers = [];
    for (let i = 0; i < data.quiz.questions.length; i++) {
      let question = data.quiz.questions[i];
      let radios = document.getElementsByName(`Q${i}`) as any;
      for (let j = 0; j < radios.length; j++) {
        if (radios[j].checked) {
          answers.push(j);
        }
      }
    }
    if (answers.length < data.quiz.questions.length) {
      alert("Please answer all questions");
      return;
    }
    // make request
    axios
      .post(`/api/courses/${courseId}/${lessonNum}/quiz`, { answers })
      .then((res) => {
        console.log(res.data);
        alert(res.data.result ? "HAY, you passed!" : "NAY, you failed.");
        window.location.href = `/courses/${courseId}/${lessonNum}`;
      })
      .catch((err) => {
        utils.alertError(alert, err, "Failed to submit quiz");
      });
  }

  return (
    <>
      <Head>
        <title>Quiz | Course Horse</title>
        <meta name="description" content="Take a quiz on Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <>
            <form className={styles.quiz}>
              <h1>Quiz</h1>
              {data.quiz.questions.map(
                (question: any, questionNumber: number) => {
                  return (
                    <div key={questionNumber}>
                      <h3>Question {questionNumber + 1}</h3>
                      <div>
                        <p>{question.question}</p>
                        <div>
                          <p>Select an option below...</p>
                          {question.answers.map(
                            (answer: any, index: number) => {
                              return (
                                <div key={`${questionNumber}_${index}`}>
                                  <input
                                    id={`Q${questionNumber}_${index}`}
                                    name={`Q${questionNumber}`}
                                    type="radio"
                                    value={index}
                                  />
                                  <label
                                    htmlFor={`Q${questionNumber}_${index}`}
                                  >
                                    {answer}
                                  </label>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
              <div hidden={username === data.creator}>
                <Button onClick={utils.createHandler(submitQuiz)}>
                  Submit Quiz
                </Button>
              </div>
            </form>
          </>
        )}
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
