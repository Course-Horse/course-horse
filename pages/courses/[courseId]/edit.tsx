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
import utils from "@/utils";

const TAGS = ["Math", "Science", "English", "History", "Art", "Music", "Other"];

export default function EditCourse({ username }: { username: any }) {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null) as any;

  useEffect(() => {
    // get course data
    axios
      .get(`/api/courses/${courseId}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        utils.alertError(alert, err, "Error loading course data.");
        window.location.href = "/courses";
      });
  }, []);

  function submitBasic() {
    // get user inputs
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
      description = validator.checkString(description, "Course Description");
      tagList = validator.checkTagList(tagList, "Tags");
    } catch (e) {
      alert(e);
      return;
    }
    // make request
    axios
      .post(`/api/courses/${courseId}`, {
        updateType: "basic",
        title,
        description,
        tags: tagList,
      })
      .then((res) => {
        console.log(res);
        window.location.href = "/courses/" + res.data._id;
      })
      .catch((err) => {
        utils.alertError(alert, err, "Error updating course. Please try again");
      });
  }

  function submitPicture() {
    // get course image
    let coursePicture = $("#courseImage")[0] as any;
    if (!coursePicture.files || !coursePicture.files[0]) {
      alert("You must provide a course image!");
      return;
    }
    let reader = new FileReader();
    reader.onload = function () {
      // validate course image
      coursePicture = reader.result;
      try {
        coursePicture = validator.checkImage(reader.result, "Course Image");
      } catch (e) {
        alert(e);
        return;
      }
      // make request
      axios
        .post(`/api/courses/${courseId}`, {
          updateType: "picture",
          coursePicture,
        })
        .then((res) => {
          console.log(res);
          window.location.href = "/courses/" + res.data._id;
        })
        .catch((err) => {
          utils.alertError(
            alert,
            err,
            "Error updating course. Please try again"
          );
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
              onSubmit={utils.createHandler(submitPicture)}
            >
              <h2>Change Course Picture</h2>
              <img src={data.coursePicture} alt="Course Image" />
              <div>
                <label htmlFor="courseImage">Course Image</label>
                <input
                  id="courseImage"
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                />
                <p>1MB Limit</p>
              </div>
              <div>
                <label htmlFor="submitPicture">Submit New Picture</label>
                <input id="submitPicture" type="submit" value="Submit" />
              </div>
            </form>
            <form
              method="POST"
              className={verticalFormStyles.form}
              onSubmit={utils.createHandler(submitBasic)}
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
