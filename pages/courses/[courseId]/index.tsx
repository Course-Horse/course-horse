import { useRouter } from "next/router";

export default function Course() {
  const router = useRouter();
  const { courseId } = router.query;

  return (
    <div>
      <h1>Course</h1>
      <p>Course ID: {courseId}</p>
    </div>
  );
}
