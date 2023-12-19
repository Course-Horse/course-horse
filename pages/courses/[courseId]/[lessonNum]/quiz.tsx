import NavBar from "@/components/navbar/navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import auth from "@/auth/";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";

export default function Quiz({ username }: { username: any }) {
  const router = useRouter();
  const { courseId, lessonNum } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null) as any;

  useEffect(() => {
    axios
      .get(`/api/courses/${courseId}/${lessonNum}`)
      .then((res) => {
        console.log(res.data);
        if (!res.data.quiz) {
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
        console.log(err);
        setLoading(false);
      });
  }, []);

  function submitQuiz(e: any) {
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
    console.log(answers);

    axios
      .post(`/api/courses/${courseId}/${lessonNum}/quiz`, { answers })
      .then((res) => {
        console.log(res.data);
        window.location.href = `/courses/${courseId}/${lessonNum}`;
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  }

  return (
    <>
      <NavBar username={username} />
      <main className="pageContainer">
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <>
            <h1>Quiz</h1>
            <form>
              {data.quiz.questions.map(
                (question: any, questionNumber: number) => {
                  return (
                    <div key={questionNumber}>
                      <h3>Question {questionNumber + 1}</h3>
                      <p>{question.question}</p>

                      <div>
                        {question.answers.map((answer: any, index: number) => {
                          return (
                            <div key={`${questionNumber}_${index}`}>
                              <input
                                id={`Q${questionNumber}_${index}`}
                                name={`Q${questionNumber}`}
                                type="radio"
                                value={index}
                              />
                              <label htmlFor={`Q${questionNumber}_${index}`}>
                                {answer}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
              <div>
                <Button onClick={submitQuiz}>Submit Quiz</Button>
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
