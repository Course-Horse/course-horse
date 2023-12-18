import Head from "next/head";

import auth from "@/auth/";

export default function AdminView() {
  return (
    <>
      <Head>
        <title>Admin | Course Horse</title>
        <meta name="description" content="Admin page for Course Horse." />
      </Head>
      <main className="pageContainer">
        <h1>Admin View</h1>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkAdmin(context);
};
