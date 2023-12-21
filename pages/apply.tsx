import Head from "next/head";
import utils from "@/utils";
import auth from "@/auth/";
import TextInputList from "@/components/textInputList/textInputList";
import verticalFormStyles from "@/styles/verticalForm.module.scss";
import NavBar from "@/components/navbar/navbar";
import $ from "jquery";
import axios from "axios";
import { useEffect, useState } from "react";
import validator from "@/data/helpers/validator.js";
import { Spinner } from "react-bootstrap";

export default function Apply({ username }: { username: any }) {
  const [loading, setLoading] = useState(false);

  function submitApplication() {
    setLoading(true);
    // get user inputs
    let applicationContent = $("#applicationContent").val();
    let documents = $("#documents input") as any;
    let documentsArr = [];
    for (let i = 0; i < documents.length; i++) {
      documentsArr.push(documents[i].value);
    }
    // validate user inputs
    try {
      applicationContent = validator.checkString(
        applicationContent,
        "Application Content"
      );
      documentsArr = validator.checkLinkStringArray(documentsArr, "Documents");
    } catch (e) {
      alert(e);
      setLoading(false);
      return;
    }
    // submit application
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
        utils.alertError(
          alert,
          err,
          "There was an error submitting your application. Please try again."
        );
        setLoading(false);
      });
  }

  useEffect(() => {
    // get user data to check if they already have an application
    axios
      .get("/api/users/")
      .then((res) => {
        if (res.data.application) {
          if (res.data.application.status === "declined") return;
          if (res.data.application.status === "pending")
            alert("You already have a pending application.");
          if (res.data.application.status === "accepted")
            alert("You are already an educator.");
          window.location.href = "/profile";
        }
      })
      .catch((err) => {
        utils.alertError(
          alert,
          err,
          "There was an error getting your current application status."
        );
        window.location.href = "/";
      });
  }, []);

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
          onSubmit={utils.createHandler(submitApplication)}
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
            {loading && <Spinner />}
          </div>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkEducator(context, true, "/courses/create");
};
