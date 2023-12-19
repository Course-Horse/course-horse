import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";
import $ from "jquery";

import validator from "@/data/helpers/validator.js";
import auth from "@/auth/";
import styles from "@/styles/courses.module.scss";
import CourseList from "@/components/courseList/courselist";
import NavBar from "@/components/navbar/navbar";

export default function Courses({ username }: { username: any }) {
  const [loadingMyCourses, setLoadingMyCourses] = useState(true);
  const [myCourses, setMyCourses] = useState([]) as any;
  const [loadingBrowse, setLoadingBrowse] = useState(true);
  const [Browse, setBrowse] = useState([]);

  useEffect(() => {
    axios
      .get("/api/courses/mycourses")
      .then((res) => {
        console.log(res.data);
        setMyCourses(res.data);
        setLoadingMyCourses(false);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("/api/courses")
      .then((res) => {
        console.log(res.data);
        setBrowse(res.data);
        setLoadingBrowse(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function searchCourses(e: any) {
    e.preventDefault();

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
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
              <p>Loading...</p>
            ) : myCourses.creator.length > 0 ? (
              <CourseList courses={myCourses.creator} />
            ) : (
              <p>You&apos;ve made no courses.</p>
            )}
          </div>
          <div>
            <h2>Enrolled Courses</h2>
            {loadingMyCourses ? (
              <p>Loading...</p>
            ) : myCourses.enrolled.length > 0 ? (
              <CourseList courses={myCourses.enrolled} />
            ) : (
              <p>No enrolled courses.</p>
            )}
          </div>
          <div className={styles.browse}>
            <h2>All Courses</h2>
            <form onSubmit={searchCourses}>
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
                  <button id="submit" type="submit">
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
                <p>Loading...</p>
              ) : Browse.length > 0 ? (
                <CourseList courses={Browse} />
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
