import Head from "next/head";

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
