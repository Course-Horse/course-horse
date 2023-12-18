import Head from "next/head";

import auth from "@/auth/";
import verticalFormStyles from "@/styles/verticalForm.module.scss";
import NavBar from "@/components/navbar/navbar";

export default function CreateCourse({ username }: { username: any }) {
  function createCourse() {}

  return (
    <>
      <Head>
        <title>Create Course | Course Horse</title>
        <meta name="description" content="Create a course on Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <h1>Create Course</h1>
        <form method="POST" className={verticalFormStyles.form}>
          <div>
            <label htmlFor="courseName">Course Name</label>
            <input id="courseName" type="text" placeholder="Course Name" />
          </div>
          <div>
            <label htmlFor="courseImage">Course Image</label>
            <input id="courseImage" type="file" />
          </div>
          <div>
            <label htmlFor="courseDescription">Course Description</label>
            <textarea id="courseDescription" placeholder="Course Description" />
          </div>
          <div>
            <label htmlFor="tags">Course Tags</label>
            <input id="tags" type="text" placeholder="Tags" />
            <p>
              Tip: Tags can only be one word. Please seperate each tag with
              spaces.
            </p>
          </div>
          <div>
            <label htmlFor="subtmit">Submit</label>
            <input id="submit" type="submit" value="Create Course" />
          </div>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkEducator(context, false, "/apply");
};
