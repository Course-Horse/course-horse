import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { courseData, lessonData } from "@/data";
import { mongo, validator } from "@/data/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  const session = await auth.getSession({ req, res });
  let courseId = req.query.courseId as string;
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be signed in to interact with courses." });

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

  switch (method) {
    // CREATE LESSON
    case "POST":
      let { title, description, content, videos, quizDescription, quiz } =
        req.body;
      try {
        title = validator.checkString(title, "title");
        description = validator.checkString(description, "description");
        content = validator.checkString(content, "content");
        videos = validator.checkStringArray(videos, "videos");
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      let quiz_obj = undefined;
      try {
        if (quizDescription && quiz) {
          quizDescription = validator.checkString(
            quizDescription,
            "quizDescription"
          );
          for (let i = 0; i < quiz.length; i++) {
            quiz[i].question = validator.checkString(
              quiz[i].question,
              `quiz[${i}].question`
            );
            quiz[i].answers = validator.checkStringArray(
              quiz[i].answers,
              `quiz[${i}].answers`
            );
            quiz[i].correct = validator.checkInt(
              quiz[i].correct,
              `quiz[${i}].correct`
            );
            if (
              quiz[i].correct < 0 ||
              quiz[i].correct >= quiz[i].answers.length
            )
              throw `a correct answer must be within bounds of the answers array`;
          }
          quiz_obj = {
            description: quizDescription,
            questions: quiz,
            completed: [],
          };
        }
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      let result;
      try {
        result = await lessonData.createLesson(
          courseId,
          title,
          description,
          content,
          videos,
          quiz_obj
        );
      } catch (e) {
        return res.status(500).json({ error: `Failed to create lesson.` });
      }

      return res.status(200).json(result);
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
