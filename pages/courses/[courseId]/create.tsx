import Head from "next/head";
import $ from "jquery";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";

import validator from "@/data/helpers/validator.js";
import verticalFormStyles from "@/styles/verticalForm.module.scss";
import createLessonStyles from "@/styles/createLesson.module.scss";
import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import TextInputList from "@/components/textInputList/textInputList";
import { Button } from "react-bootstrap";

export default function CreateLesson({ username }: { username: any }) {
  const { courseId } = useParams();
  const [hasQuiz, setHasQuiz] = useState(false);
  const [quiz, setQuiz] = useState([]);

  function toggleQuiz() {
    setHasQuiz(!hasQuiz);
  }

  function addQuestion() {
    setQuiz([...quiz, {}]);
  }

  function removeQuestion() {
    setQuiz(quiz.slice(0, -1));
  }

  function submitLesson(e: any) {
    e.preventDefault();
    let title = $("#lessonName").val();
    let description = $("#lessonDescription").val();
    let content = $("#lessonContent").val();
    let videos = $("#ytLinks input");
    let videoList = [];
    for (let video of videos) {
      if (video.value) {
        videoList.push(video.value);
      }
    }

    let quiz = null;
    let quizDescription = null;
    if (hasQuiz) {
      let questions = $("#quiz > div");
      let questionList = [];
      for (let question of questions) {
        let questionText = $(question).find("textarea").val();
        let answers = $(question).find(".answers input");
        let answerList = [];
        for (let answer of answers) {
          if (answer.value) {
            answerList.push(answer.value);
          }
        }
        let correctAnswer = $(question)
          .find(".correctAnswer input[type=number]")
          .val();
        questionList.push({
          question: questionText,
          answers: answerList,
          correctAnswer: Number(correctAnswer) - 1,
        });
      }
      quiz = questionList;
      quizDescription = $("#quizDescription").val();
    }

    console.log(title, description, content, videoList, quizDescription, quiz);

    try {
      title = validator.checkString(title, "Lesson Name");
      description = validator.checkString(description, "Lesson Description");
      content = validator.checkString(content, "Lesson Content");
      videoList = validator.checkVideoStringArray(videoList, "Youtube Links");
      quizDescription = validator.checkString(
        quizDescription,
        "Quiz Description"
      );
    } catch (e) {
      alert(e);
      return;
    }

    axios
      .post(`/api/courses/${courseId}/create`, {
        title,
        description,
        content,
        videos: videoList,
        quizDescription,
        quiz,
      })
      .then((res) => {
        console.log(res);
        window.location.href = `/courses/${courseId}`;
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data) {
          alert(err.response.data.error);
        } else {
          alert("error occurred please try again");
        }
      });
  }

  return (
    <>
      <Head>
        <title>Create Lesson | Course Horse</title>
        <meta name="description" content="Create a Lesson on Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <h1>Create Lesson</h1>
        <form
          method="POST"
          className={verticalFormStyles.form}
          onSubmit={submitLesson}
        >
          <div>
            <label htmlFor="lessonName">Lesson Name</label>
            <input id="lessonName" type="text" placeholder="Lesson Name" />
          </div>
          <div>
            <label htmlFor="lessonDescription">Lesson Description</label>
            <textarea id="lessonDescription" placeholder="Lesson Description" />
          </div>
          <div>
            <label htmlFor="lessonContent">Lesson Content</label>
            <textarea id="lessonContent" placeholder="Lesson Content" />
            <p>Tips: Lesson Content is able to be written in markdown.</p>
          </div>
          <TextInputList
            listId="ytLinks"
            listTitle="Youtube Video Links"
            addButtonText="Add Video Link"
            removeButtonText="Remove"
          />
          <div className={createLessonStyles.quizSection}>
            <h2>Quiz</h2>
            <div
              className={createLessonStyles.quizDescription}
              hidden={!hasQuiz}
            >
              <label htmlFor="quizDescription">Quiz Description</label>
              <textarea id="quizDescription" placeholder="Quiz Description" />
            </div>
            <div
              id="quiz"
              hidden={!hasQuiz}
              className={createLessonStyles.quiz}
            >
              {quiz.map((question: any, index: number) => {
                return (
                  <div>
                    <h3>Question {index + 1}</h3>
                    <div>
                      <label htmlFor={`question${index}`}>
                        Question Prompt
                      </label>
                      <textarea placeholder="Question" />
                    </div>
                    <div className="answers">
                      <TextInputList
                        listId={`answers${index}`}
                        listTitle="Answers"
                        addButtonText="Add Answer"
                        removeButtonText="Remove"
                      />
                    </div>
                    <div className="correctAnswer">
                      <label htmlFor={`correctAnswer${index}`}>
                        Correct Answer
                      </label>
                      <input
                        id={`correctAnswer${index}`}
                        type="number"
                        placeholder="Correct Answer"
                        min={1}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              hidden={!hasQuiz}
              className={createLessonStyles.questionButtons}
            >
              <Button variant="secondary" onClick={addQuestion}>
                Add Question
              </Button>
              <Button variant="warning" onClick={removeQuestion}>
                Remove Question
              </Button>
            </div>
            <Button
              variant={hasQuiz ? "danger" : "primary"}
              onClick={toggleQuiz}
            >
              {hasQuiz ? "Remove Quiz" : "Add Quiz"}
            </Button>
          </div>
          <div>
            <label htmlFor="submit">Submit</label>
            <input id="submit" type="submit" value="Create Lesson" />
          </div>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkEducator(context, false, "/apply");
};
