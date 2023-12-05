import Head from "next/head";
import Image from "next/image";
import { getSession } from "next-auth/react";

import styles from "@/styles/courses.module.scss";
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import CourseList from "@/components/courseList/courselist";

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

export default function Courses() {
  return (
    <>
      <Head>
        <title>Courses | Course Horse</title>
        <meta name="description" content="View all courses on Course Horse." />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <h1>Courses</h1>
        <div className={styles.courseListingWrapper}>
          <div>
            <h2>My Courses</h2>
            <CourseList courses={dummyCourses} />
          </div>
          <div>
            <h2>Other Courses</h2>
            <CourseList courses={dummyCourses} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
