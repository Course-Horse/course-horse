import Head from "next/head";

import auth from "@/auth/";
import styles from "@/styles/courses.module.scss";
import CourseList from "@/components/courseList/courselist";
import NavBar from "@/components/navbar/navbar";

const dummyCourses = [
  {
    id: 1,
    name: "Course 1",
    description: "Course 1 Description",
    image: "/favicon.ico",
  },
  {
    id: 2,
    name: "Course 2",
    description: "Course 2 Description",
    image: "/favicon.ico",
  },
];

export default function Courses({ username }: { username: any }) {
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
            <CourseList courses={dummyCourses} />
          </div>
          <div>
            <h2>Enrolled Courses</h2>
            <CourseList courses={dummyCourses} />
          </div>
          <div className={styles.browse}>
            <h2>Browse Other Courses</h2>
            <form>
              <div>
                <label htmlFor="title">Course Title</label>
                <input id="title" type="text" placeholder="Title" />
              </div>
              <div>
                <label htmlFor="sortBy">Sort By</label>
                <select id="sortBy">
                  <option value="title">Title</option>
                  <option value="date">Date</option>
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
            </form>
            <div>
              <CourseList courses={dummyCourses} />
              <button>Load More</button>
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
