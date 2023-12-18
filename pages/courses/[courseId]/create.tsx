import Head from "next/head";
import $ from "jquery";
import axios from "axios";
import { useParams } from "next/navigation";

import validator from "@/data/helpers/validator.js";
import verticalFormStyles from "@/styles/verticalForm.module.scss";
import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import TextInputList from "@/components/textInputList/textInputList";

export default function CreateLesson({ username }: { username: any }) {
  const { courseId } = useParams();

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
    let quiz = undefined;

    console.log(title, description, content, videoList, quiz);

    try {
      title = validator.checkString(title, "Lesson Name");
      description = validator.checkString(description, "Lesson Description");
      content = validator.checkString(content, "Lesson Content");
      videoList = validator.checkVideoStringArray(videoList, "Youtube Links");
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
          <div>
            <label htmlFor="subtmit">Submit</label>
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
