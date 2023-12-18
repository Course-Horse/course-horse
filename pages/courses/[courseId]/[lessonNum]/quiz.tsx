import NavBar from "@/components/navbar/navbar";
import { useRouter } from "next/router";

export default function Quiz({ username }: { username: any }) {
  const router = useRouter();
  const { courseId, lessonNum } = router.query;

  return (
    <>
      <NavBar username={username} />
      <main className="pageContainer">
        <h1>Quiz</h1>
        <p>
          Course ID: {courseId}, Lesson Number: {lessonNum}
        </p>
      </main>
    </>
  );
}

import auth from "@/auth/";

export const getServerSideProps = async (context: any) => {
  return auth.checkAuthenticated(context, false, "/signin");
};
