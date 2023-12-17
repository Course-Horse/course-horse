import Head from "next/head";

import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default function AdminView() {
  return (
    <>
      <Head>
        <title>Admin | Course Horse</title>
        <meta name="description" content="Admin page for Course Horse." />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <h1>Admin View</h1>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkRole(context, ["admin"], "/");
};
