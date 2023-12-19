import Head from "next/head";

import auth from "@/auth/";
import NavBar from "@/components/navbar/navbar";
import styles from "@/styles/admin.module.scss";
import { Button } from "react-bootstrap";
import { useParams } from "next/navigation";

export default function AdminView({ username }: { username: any }) {
  const { username: usernameQ } = useParams();

  return (
    <>
      <Head>
        <title>Admin | Course Horse</title>
        <meta name="description" content="Admin page for Course Horse." />
      </Head>
      <NavBar username={username} />
      <main className="pageContainer">
        <h1>{usernameQ}&apos;s Application</h1>

        <div id="application" className={styles.application}>
          <div id="applicationDetails" className={styles.applicationDetails}>
            <img src="/logo.png" alt="profile picture" />
            <div>
              <h2>username</h2>
              <p>firstName lastName</p>
              <p>email</p>
            </div>

            <div className={styles.applicationContent}>
              <h3>Application Content</h3>
              <p>content from markdown</p>
            </div>
            <div>
              <h3>Additional Documents</h3>
              <div>list here</div>
            </div>
          </div>
          <div id="applicationActions" className={styles.applicationActions}>
            <Button variant="success">Accept Application</Button>
            <Button variant="warning">Set to Pending</Button>
            <Button variant="danger">Reject Application</Button>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  return await auth.checkAdmin(context);
};
