import Head from "next/head";

import auth from "@/auth/";
import TextInputList from "@/components/textInputList/textInputList";
import verticalFormStyles from "@/styles/verticalForm.module.scss";
import NavBar from "@/components/navbar/navbar";
import $ from "jquery";
import axios from "axios";

export default function Apply({ username }: { username: any }) {
  function submitApplication(e: any) {
    e.preventDefault();
    let applicationContent = $("#applicationContent").val();
    let documents = $("#documents input") as any;
    let documentsArr = [];
    for (let i = 0; i < documents.length; i++) {
      documentsArr.push(documents[i].value);
    }

    console.log(applicationContent, documentsArr);
    axios
      .post(`/api/applications/`, {
        content: applicationContent,
        documents: documentsArr,
      })
      .then((res) => {
        console.log(res);
        alert("Application submitted.");
        window.location.href = "/profile";
      })
      .catch((err) => {
        console.log(err);
        alert("Unable to submit application.");
      });
  }

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
        <form
          method="POST"
          className={verticalFormStyles.form}
          onSubmit={submitApplication}
        >
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
