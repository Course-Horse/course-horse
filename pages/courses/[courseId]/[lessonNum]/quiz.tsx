import { useRouter } from "next/router";

export default function Quiz() {
  const router = useRouter();
  const { courseId, lessonNum } = router.query;

  return (
    <div>
      <h1>Quiz</h1>
      <p>Course ID: {courseId}</p>
      <p>Lesson ID: {lessonNum}</p>
    </div>
  );
}
