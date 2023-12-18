import NavBar from "@/components/navbar/navbar";

export default function EditLesson({ username }: { username: string }) {
  return (
    <>
      <Head>
        <title>Edit Lesson | Course Horse</title>
        <meta name="description" content="Edit a lesson on Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <h1>Edit Lesson</h1>
      </main>
    </>
  );
}

import auth from "@/auth/";
import Head from "next/head";

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
