import { getSession, useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Head from "next/head";
import NavBar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default function MyProfile() {
  const { data: session } = useSession();
  console.log(session);

  async function submitHandler(e: any) {
    e.preventDefault();
    const result = await signOut({ callbackUrl: "/" });
  }

  return (
    <>
      <Head>
        <title>My Profile | Course Horse</title>
        <meta name="description" content="View your profile on Course Horse." />
      </Head>
      <NavBar />
      <main className="pageContainer">
        <h1>My Profile</h1>
        <p>Username: {session?.user?.name || "N/A"}</p>
        <button onClick={submitHandler}>Sign Out</button>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
