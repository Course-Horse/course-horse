import Head from "next/head";

import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import TextInputList from "@/components/textInputList/textInputList";
import verticalFormStyles from "@/styles/verticalForm.module.scss";

export default function Apply() {
  return (
    <>
      <Head>
        <title>Apply | Course Horse</title>
        <meta
          name="description"
          content="Apply to become an educator on Course Horse."
        />
      </Head>
      <NavBar />
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
      <Footer />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  let check = await auth.checkAuthenticated(context, false, "/signin");
  if (check.redirect !== undefined) return check;
  return await auth.checkRole(context, ["learner", "admin"], "/courses/create");
};
