import CourseListing from "@/components/courseListing/courseListing";

import styles from "./courselist.module.scss";

export default function CourseList({ courses }: { courses: any }) {
  return (
    <div className={styles.list}>
      {courses.map((course: any) => {
        return <CourseListing key={course.title} {...course} />;
      })}
    </div>
  );
}
