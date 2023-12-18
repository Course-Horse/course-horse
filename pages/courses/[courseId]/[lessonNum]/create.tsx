import Head from "next/head";

import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default function Create() {
  return (
    <>
      <Head>
        <title>Create Quiz | Course Horse</title>
        <meta name="description" content="Create Quiz" />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <h1>Create Quiz</h1>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkEducator(context, false, "/apply");
};
