import Head from "next/head";

import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default function CreateCourse() {
  return (
    <>
      <Head>
        <title>Create Course | Course Horse</title>
        <meta name="description" content="Create a course on Course Horse." />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <h1>Create Course</h1>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  let check = await auth.checkAuthenticated(context, false, "/signin");
  if (check.redirect !== undefined) return check;
  return await auth.checkRole(context, ["educator", "admin"], "/apply");
};
