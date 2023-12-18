import Head from "next/head";
import { Image } from "react-bootstrap";

import styles from "@/styles/index.module.scss";

export default function Home({ username }: { username: any }) {
  return (
    <>
      <Head>
        <title>Home | Course Horse</title>
        <meta
          name="description"
          content="Your all-in-one online learning platform."
        />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <div className={styles.header}>
          <Image src="/logo.png" />
          <h1>Course Horse</h1>
          <p>Your all-in-one online learning platform.</p>
        </div>
        <div className={styles.section}>
          <div>
            <h2>What is Course Horse?</h2>
            <div>
              <p>
                Course Horse is an online learning platform that connects
                learners to courses made by educators.
              </p>
              <p>
                Students can enroll in courses in a variety of topics, from
                burger flipping to multi-variable calculus.
              </p>
              <p>
                Start your learning journey today by creating an account today.
              </p>
            </div>
          </div>
          <div>
            <Image src="/horse.gif" />
          </div>
        </div>
      </main>
    </>
  );
}

import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";

export async function getServerSideProps(context: any) {
  const session = await auth.getSession(context);
  let result = {};
  let username = session.username;
  if (username) result = { username };
  return { props: result };
}
