import Head from "next/head";

import auth from "@/auth/";
import TextInputList from "@/components/textInputList/textInputList";
import verticalFormStyles from "@/styles/verticalForm.module.scss";
import NavBar from "@/components/navbar/navbar";

export default function Apply({ username }: { username: any }) {
  return (
    <>
      <Head>
        <title>Apply | Course Horse</title>
        <meta
          name="description"
          content="Apply to become an educator on Course Horse."
        />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <h1>Apply</h1>
        <form method="POST" className={verticalFormStyles.form}>
          <div>
            <label htmlFor="applicationContent">Application Content</label>
            <textarea
              id="applicationContent"
              placeholder="Application Content"
            />
            <p>Tip: Application Content is able to be written in markdown.</p>
          </div>
          <TextInputList
            listId="documents"
            listTitle="Additional Documents"
            addButtonText="Add Link"
            removeButtonText="Remove"
          />
          <div>
            <label htmlFor="submit">Submit Application</label>
            <input id="submit" type="submit" value="Apply" />
          </div>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkEducator(context, true, "/courses/create");
};
