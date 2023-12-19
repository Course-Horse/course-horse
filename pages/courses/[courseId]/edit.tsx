import Head from "next/head";
import $ from "jquery";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import auth from "@/auth/";
import validator from "@/data/helpers/validator.js";
import verticalFormStyles from "@/styles/verticalForm.module.scss";
import NavBar from "@/components/navbar/navbar";
import { Spinner } from "react-bootstrap";

const TAGS = ["Math", "Science", "English", "History", "Art", "Music", "Other"];

export default function EditCourse({ username }: { username: any }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null) as any;
  const { courseId } = useParams();

  useEffect(() => {
    axios
      .get(`/api/courses/${courseId}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data) {
          alert(err.response.data.error);
        } else {
          alert("error occurred please try again");
        }
      });
  }, []);

  function submitBasic(e: any) {
    e.preventDefault();
    let title = $("#courseName").val();
    let description = $("#courseDescription").val();
    let tags = $("#tags div input") as any;
    let tagList = [];
    for (let tag of tags) {
      if (tag.checked) {
        tagList.push(tag.value);
      }
    }

    try {
      title = validator.checkString(title, "Course Name");
      description = validator.checkString(description, "Course Description");
      tagList = validator.checkStringArray(tagList, "Tags");
    } catch (e) {
      alert(e);
      return;
    }

    axios
      .post(`/api/courses/${courseId}`, {
        updateType: "basic",
        title,
        description,
        tags: tagList,
      })
      .then((res) => {
        console.log(res);
        let courseId = res.data._id;
        window.location.href = "/courses/" + courseId;
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

  function submitPicture(e: any) {
    e.preventDefault();
    let coursePicture = $("#courseImage")[0] as any;
    if (!coursePicture.files || !coursePicture.files[0]) {
      alert("You must provide a course image!");
      return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
      coursePicture = reader.result;

      try {
        coursePicture = validator.checkImage(reader.result, "Course Image");
      } catch (e) {
        alert(e);
        return;
      }

      axios
        .post(`/api/courses/${courseId}`, {
          updateType: "picture",
          coursePicture,
        })
        .then((res) => {
          console.log(res);
          let courseId = res.data._id;
          window.location.href = "/courses/" + courseId;
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.data) {
            alert(err.response.data.error);
          } else {
            alert("error occurred please try again");
          }
        });
    };
    reader.readAsDataURL(coursePicture.files[0]);
  }

  return (
    <>
      <Head>
        <title>Edit Course | Course Horse</title>
        <meta name="description" content="Edit a course on Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <h1>Edit Course</h1>
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <div className={verticalFormStyles.sideBy}>
            <form
              method="POST"
              className={verticalFormStyles.form}
              onSubmit={submitPicture}
            >
              <h2>Change Course Picture</h2>
              <img src={data.coursePicture} />
              <div>
                <label htmlFor="courseImage">Course Image</label>
                <input
                  id="courseImage"
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                />
              </div>
              <div>
                <label htmlFor="submitPicture">Submit New Picture</label>
                <input id="submitPicture" type="submit" value="Submit" />
              </div>
            </form>
            <form
              method="POST"
              className={verticalFormStyles.form}
              onSubmit={submitBasic}
            >
              <h2>Change Course Info</h2>
              <div>
                <label htmlFor="courseName">Course Name</label>
                <input
                  id="courseName"
                  type="text"
                  placeholder="Course Name"
                  defaultValue={data.title}
                />
              </div>
              <div>
                <label htmlFor="courseName">Course Description</label>
                <textarea
                  id="courseDescription"
                  placeholder="Course Description"
                  defaultValue={data.description}
                />
              </div>
              <div id="tags">
                <h4>Course Tags</h4>
                {TAGS.map((tag) => {
                  let lower = tag.toLocaleLowerCase();
                  return (
                    <div key={tag}>
                      <input
                        type="checkbox"
                        id={lower}
                        name={lower}
                        value={lower}
                        defaultChecked={data.tags.includes(lower)}
                      />
                      <label htmlFor={lower}>{tag}</label>
                    </div>
                  );
                })}
              </div>
              <div>
                <label htmlFor="submitBasic">Apply</label>
                <input id="submitBasic" type="submit" value="Submit" />
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkEducator(context, false, "/apply");
};
