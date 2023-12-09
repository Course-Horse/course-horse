import Head from "next/head";

import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

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
