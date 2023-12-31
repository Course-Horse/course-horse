import Head from "next/head";
import $ from "jquery";
import { useState } from "react";
import validator from "@/data/helpers/validator.js";
import auth from "@/auth/";
import verticalFormStyles from "@/styles/verticalForm.module.scss";
import NavBar from "@/components/navbar/navbar";
import axios from "axios";
import utils from "@/utils";
import { Spinner } from "react-bootstrap";

export default function CreateCourse({ username }: { username: any }) {
  const [loading, setLoading] = useState(false);

  function submitCourse() {
    // get course image
    let coursePicture = $("#courseImage")[0] as any;
    if (!coursePicture.files || !coursePicture.files[0]) {
      alert("You must provide a course image!");
      return;
    }
    let reader = new FileReader();
    reader.onload = function () {
      coursePicture = reader.result;
      // get all other inputs
      let title = $("#courseName").val();
      let description = $("#courseDescription").val();
      let tags = $("#tags div input") as any;
      let tagList = [];
      for (let tag of tags) {
        if (tag.checked) {
          tagList.push(tag.value);
        }
      }
      // validate inputs
      try {
        title = validator.checkString(title, "Course Name");
        coursePicture = validator.checkImage(reader.result, "Course Image");
        description = validator.checkString(description, "Course Description");
        tagList = validator.checkTagList(tagList, "Tags");
      } catch (e) {
        alert(e);
        setLoading(false);
        return;
      }
      // make request
      axios
        .post("/api/courses/", {
          title,
          coursePicture,
          description,
          tags: tagList,
        })
        .then((res) => {
          console.log(res);
          window.location.href = "/courses/" + res.data._id;
        })
        .catch((err) => {
          utils.alertError(
            alert,
            err,
            "Failed to create course. Please try again."
          );
          setLoading(false);
        });
    };
    reader.readAsDataURL(coursePicture.files[0]);
  }

  return (
    <>
      <Head>
        <title>Create Course | Course Horse</title>
        <meta name="description" content="Create a course on Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <h1>Create Course</h1>
        <form
          method="POST"
          className={verticalFormStyles.form}
          onSubmit={utils.createHandler(submitCourse)}
        >
          <div>
            <label htmlFor="courseName">Course Name</label>
            <input id="courseName" type="text" placeholder="Course Name" />
          </div>
          <div>
            <label htmlFor="courseImage">Course Image</label>
            <input id="courseImage" type="file" />
            <p>1MB Limit</p>
          </div>
          <div>
            <label htmlFor="courseDescription">Course Description</label>
            <textarea id="courseDescription" placeholder="Course Description" />
          </div>
          <div id="tags">
            <h4>Course Tags</h4>
            {validator.TAGS.map((tag) => {
              let lower = tag.toLocaleLowerCase();
              return (
                <div key={tag}>
                  <input
                    type="checkbox"
                    id={lower}
                    name={lower}
                    value={lower}
                  />
                  <label htmlFor={lower}>{tag}</label>
                </div>
              );
            })}
          </div>
          <div>
            <label htmlFor="subtmit">Submit</label>
            <input
              id="submit"
              type="submit"
              value="Create Course"
              disabled={loading}
            />
          </div>
          {loading && (
            <div>
              <Spinner />
            </div>
          )}
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkEducator(context, false, "/apply");
};
