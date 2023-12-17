import Head from "next/head";

import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default function Admin() {
  return (
    <>
      <Head>
        <title>Admin | Course Horse</title>
        <meta name="description" content="Admin page for Course Horse." />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <h1>Admin</h1>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkRole(context, ["admin"], "/");
};
