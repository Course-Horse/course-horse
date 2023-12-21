import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { courseData, lessonData } from "@/data";
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
      .json({ error: "You must be signed in to create lessons" });

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

  const method = req.method;
  // CREATE LESSON
  if (method === "POST") {
    // get and validate user inputs
    let { title, description, content, videos, quiz } = req.body;
    // validate basic inputs
    try {
      title = validator.checkString(title, "title");
      description = validator.checkString(description, "description");
      content = validator.checkString(content, "content");
      videos = validator.checkVideoStringArray(videos, "videos");
      if (quiz !== undefined) quiz = validator.checkQuiz(quiz, "quiz");
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // create lesson
    let result;
    try {
      result = await lessonData.createLesson(
        courseId,
        title,
        description,
        content,
        videos,
        quiz
      );
    } catch (e) {
      return res.status(500).json({ error: `Failed to create lesson.` });
    }

    // return lesson
    return res.status(200).json(result);
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
