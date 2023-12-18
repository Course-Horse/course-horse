import CourseListing from "@/components/courseListing/courseListing";

import styles from "./courselist.module.scss";

export default function CourseList({ courses }) {
  return (
    <div className={styles.list}>
      {courses.map((course) => {
        return <CourseListing key={course.title} {...course} />;
      })}
    </div>
  );
}
