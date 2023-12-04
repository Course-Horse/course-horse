import { useRouter } from "next/router";

export default function Lesson() {
  const router = useRouter();
  const { courseId, lessonId } = router.query;

  return (
    <div>
      <h1>Lesson</h1>
      <p>Course ID: {courseId}</p>
      <p>Lesson ID: {lessonId}</p>
    </div>
  );
}
