import { useRouter } from "next/router";
import Head from "next/head";

import styles from "@/styles/course.module.scss";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { Button } from "react-bootstrap";

export default function Course() {
  const router = useRouter();
  const { courseId } = router.query;

  return (
    <>
      <Head>
        <title>Course | Course Horse</title>
        <meta name="description" content="View a course on Course Horse." />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <div className={styles.course}>
          <img src="/favicon.ico" />
          <h1>Course Title</h1>
          <p>Course Description</p>
        </div>
        <div>
          <h2>Lessons</h2>
          <div>
            <h3>Lesson 1: Lesson Name</h3>
            <p>Lesson 1 Description</p>
            <div>
              <Button>Go to Lesson Content</Button>
              <Button variant="secondary">Go to Lesson Quiz</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
