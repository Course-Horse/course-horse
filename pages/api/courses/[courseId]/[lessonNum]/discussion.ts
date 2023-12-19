import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { courseData, lessonData, userData } from "@/data";
import { mongo, validator } from "@/data/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = (await auth.getSession({ req, res })) as any;
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be signed in to interact with lessons." });

  let user;
  try {
    user = await userData.getUser(session.username);
  } catch (e) {
    return res.status(404).json({ error: "User not found." });
  }

  let courseId = req.query.courseId as string;
  try {
    courseId = mongo.checkId(courseId);
  } catch (e) {
    return res.status(400).json({ error: "Invalid course ID." });
  }

  let course;
  try {
    course = await courseData.getCourse(courseId);
  } catch (e) {
    return res.status(404).json({ error: "Course not found." });
  }

  let lessonNum = req.query.lessonNum as any;
  lessonNum = Number(lessonNum);
  try {
    lessonNum = validator.checkInt(lessonNum, "lessonNum");
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  let lesson;
  try {
    lesson = await lessonData.getLesson(course.lessons[lessonNum].toString());
  } catch (e) {
    return res.status(404).json({ error: "Lesson not found." });
  }

  const method = req.method;
  let result;
  switch (method) {
    // returns the discussion for a specified lesson
    case "GET":
      return res.status(200).json({ discussion: lesson.discussion });

    // adds a message object to the discussion array of a specified lesson
    case "POST":
      let { message } = req.body;
      try {
        result = await lessonData.createMessage(
          lesson._id.toString(),
          session.username,
          message
        );
      } catch (e) {
        return res.status(500).json({ error: e });
      }
      return res.status(200).json({ discussion: result });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
