import { useRouter } from "next/router";
import Head from "next/head";

// import styles from "@/styles/course.module.scss";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { Button } from "react-bootstrap";

export default function Lesson() {
  const router = useRouter();
  const { courseId, lessonId } = router.query;

  return (
    <>
      <Head>
        <title>Course | Course Horse</title>
        <meta name="description" content="View a course on Course Horse." />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <div>
          <img src="/favicon.ico" />
          <h1>Lesson 1: Lesson Title</h1>
          <p>Lesson Summary</p>
        </div>
        <div>
          <h2>Lesson Content</h2>
          <div>
            <p>Insert converted markdown</p>
          </div>
          <div>
            <h3>Lesson Videos</h3>
            <div>
              <p>Insert Embeds</p>
            </div>
          </div>
        </div>
        <div>
          <h2>Lesson Quiz</h2>
          <p>Quiz Description</p>
          <Button>Start Quiz</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
