import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { courseData, lessonData, userData } from "@/data";
import { mongo, validator } from "@/data/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = (await auth.getSession({ req, res })) as any;
  // check if user is signed in
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be signed in to interact with lessons." });

  // get and validate course id
  let courseId = req.query.courseId as string;
  try {
    courseId = mongo.checkId(courseId);
  } catch (e) {
    return res.status(400).json({ error: "Invalid course ID." });
  }

  // get course
  let course;
  try {
    course = await courseData.getCourse(courseId);
  } catch (e) {
    return res.status(404).json({ error: "Course not found." });
  }

  // get and validate lesson number
  let lessonNum = req.query.lessonNum as any;
  try {
    lessonNum = Number(lessonNum);
    if (!lessonNum && lessonNum !== 0)
      return res.status(400).json({ error: "lessonNum is not a number." });
    lessonNum = validator.checkInt(lessonNum, "lessonNum");
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  // check if lesson number is in range
  if (lessonNum < 0 || lessonNum >= course.lessons.length)
    return res.status(400).json({ error: "Lesson number doesn't exist." });

  const method = req.method;
  // GET LESSON
  if (method === "GET") {
    // get user data
    let user;
    try {
      user = await userData.getUser(session.username);
    } catch (e) {
      return res.status(404).json({ error: "User not found." });
    }

    // check if user is creator or enrolled in course
    if (
      session.username !== course.creator &&
      !user.enrolledCourses.includes(courseId)
    )
      return res
        .status(403)
        .json({ error: "You are not enrolled in this course." });

    // get lesson data
    let result = undefined as any;
    try {
      result = await lessonData.getLesson(course.lessons[lessonNum].toString());
    } catch (e) {
      return res.status(404).json({ error: "Lesson not found." });
    }

    // append course data to lesson data and return
    result.courseTitle = course.title;
    result.coursePicture = course.coursePicture;
    result.creator = course.creator;
    return res.status(200).json(result);
  }

  // UPDATE LESSON
  if (method === "POST") {
    return res.status(500).json({ TODO: `IMPLEMENT ME` });
  }

  // DELETE LESSON
  if (method === "DELETE") {
    // check if user is the creator
    if (session.username !== course.creator)
      return res.status(403).json({
        error: "You must be the course creator to delete lessons.",
      });

    // attempt to delete lesson
    try {
      await lessonData.deleteLesson(course.lessons[lessonNum].toString());
    } catch (e) {
      return res.status(500).json({ error: `Failed to delete lesson.` });
    }

    // return success message
    return res.status(200).json({ success: `Lesson deleted.` });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
