import Head from "next/head";

import verticalFormStyles from "@/styles/verticalForm.module.scss";
import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import TextInputList from "@/components/textInputList/textInputList";

export default function CreateLesson() {
  function createLesson() {}

  return (
    <>
      <Head>
        <title>Create Lesson | Course Horse</title>
        <meta name="description" content="Create a Lesson on Course Horse." />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <h1>Create Lesson</h1>
        <form method="POST" className={verticalFormStyles.form}>
          <div>
            <label htmlFor="lessonName">Lesson Name</label>
            <input id="lessonName" type="text" placeholder="Lesson Name" />
          </div>
          <div>
            <label htmlFor="lessonDescription">Lesson Description</label>
            <textarea id="lessonDescription" placeholder="Lesson Description" />
          </div>
          <div>
            <label htmlFor="lessonContent">Lesson Content</label>
            <textarea id="lessonContent" placeholder="Lesson Content" />
            <p>Tips: Lesson Content is able to be written in markdown.</p>
          </div>
          <TextInputList
            listId="ytLinks"
            listTitle="Youtube Video Links"
            addButtonText="Add Video Link"
            removeButtonText="Remove"
          />
          <div>
            <label htmlFor="subtmit">Submit</label>
            <input id="submit" type="submit" value="Create Lesson" />
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkEducator(context, false, "/apply");
};
