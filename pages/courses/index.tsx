import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";
import $ from "jquery";

import utils from "@/utils";
import validator from "@/data/helpers/validator.js";
import auth from "@/auth/";
import styles from "@/styles/courses.module.scss";
import CourseList from "@/components/courseList/courselist";
import NavBar from "@/components/navbar/navbar";
import { Spinner } from "react-bootstrap";

export default function Courses({ username }: { username: any }) {
  const [loadingMyCourses, setLoadingMyCourses] = useState(true);
  const [myCourses, setMyCourses] = useState([]) as any;
  const [loadingBrowse, setLoadingBrowse] = useState(true);
  const [Browse, setBrowse] = useState([]);
  const [completed, setCompleted] = useState(null) as any;

  function searchCourses() {
    setLoadingBrowse(true);
    // get user inputs
    let title = $("#title").val();
    let sortBy = $("#sortBy").val();
    let sortOrder = $("#sortOrder").val();
    let tags = $("#tags div input") as any;
    let tagList = [];
    for (let tag of tags) {
      if (tag.checked) {
        tagList.push(tag.value);
      }
    }
    // validate inputs
    try {
      // title = validator.checkString(title, "title"); ignore title
      sortBy = validator.checkSortByCourse(sortBy, "sortBy");
      sortOrder = validator.checkSortOrder(sortOrder, "sortOrder");
      tagList = validator.checkTagList(tagList, "tag list");
    } catch (e) {
      alert(e);
      setLoadingBrowse(false);
      return;
    }
    // send request
    axios
      .get("/api/courses/", {
        params: {
          title,
          sortBy,
          sortOrder,
          tags: JSON.stringify(tagList),
        },
      })
      .then((res) => {
        console.log(res.data);
        setBrowse(res.data);
        setLoadingBrowse(false);
      })
      .catch((err) => {
        utils.alertError(
          alert,
          err,
          "Error searching courses. Please try again."
        );
        setLoadingBrowse(false);
      });
  }

  useEffect(() => {
    // get users created and enrolled courses
    axios
      .get("/api/courses/mycourses")
      .then((res) => {
        console.log(res.data);
        setMyCourses(res.data);
        setLoadingMyCourses(false);
      })
      .catch((err) => {
        utils.alertError(alert, err, "Error getting your courses.");
        window.location.href = "/profile";
      });
    // get courses to browse
    searchCourses();
    // get completed courses
    axios
      .get("/api/courses/completed")
      .then((res) => {
        console.log(res.data);
        setCompleted(res.data);
      })
      .catch((err) => {
        utils.alertError(alert, err, "Error getting completed courses.");
        window.location.href = "/profile";
      });
  }, []);

  return (
    <>
      <Head>
        <title>Courses | Course Horse</title>
        <meta name="description" content="View all courses on Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <h1>Courses</h1>
        <div className={styles.courseListingWrapper}>
          <div>
            <h2>My Courses</h2>
            {loadingMyCourses ? (
              <Spinner />
            ) : myCourses.creator.length > 0 ? (
              <CourseList
                courses={myCourses.creator}
                completed={completed ? completed.completed : null}
              />
            ) : (
              <p>You&apos;ve made no courses.</p>
            )}
          </div>
          <div>
            <h2>Enrolled Courses</h2>
            <div>
              {completed && completed.tags.length > 0
                ? completed.tags.length <= 3
                  ? `Top ${
                      completed.tags.length
                    } tags of completed courses: ${completed.tags.join(", ")}`
                  : `Top 3 tags of completed courses: ${completed.tags
                      .slice(0, 3)
                      .join(", ")}`
                : null}
            </div>
            {loadingMyCourses ? (
              <Spinner />
            ) : myCourses.enrolled.length > 0 ? (
              <CourseList
                courses={myCourses.enrolled}
                completed={completed ? completed.completed : null}
              />
            ) : (
              <p>No enrolled courses.</p>
            )}
          </div>
          <div className={styles.browse}>
            <h2>All Courses</h2>
            <form onSubmit={utils.createHandler(searchCourses)}>
              <div>
                <div>
                  <label htmlFor="title">Course Title</label>
                  <input id="title" type="text" placeholder="Title" />
                </div>
                <div>
                  <label htmlFor="sortBy">Sort By</label>
                  <select id="sortBy">
                    <option value="title">Title</option>
                    <option value="created">Created</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sortOrder">Sort Order</label>
                  <select id="sortOrder">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="submit">Submit</label>
                  <button id="submit" type="submit" disabled={loadingBrowse}>
                    Search
                  </button>
                </div>
              </div>
              <div id="tags">
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
            </form>
            <div>
              {loadingBrowse ? (
                <Spinner />
              ) : Browse.length > 0 ? (
                <CourseList
                  courses={Browse}
                  completed={completed ? completed.completed : null}
                />
              ) : (
                <p>No courses found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
