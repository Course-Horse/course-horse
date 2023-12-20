import CourseListing from "@/components/courseListing/courseListing";

import styles from "./courselist.module.scss";

export default function CourseList({
  courses,
  completed,
}: {
  courses: any;
  completed: any;
}) {
  return (
    <div className={styles.list}>
      {courses.map((course: any) => {
        return (
          <CourseListing key={course.title} {...course} completed={completed} />
        );
      })}
    </div>
  );
}
