import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { courseData, lessonData, userData } from "@/data";
import { mongo, validator } from "@/data/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  const session = await auth.getSession({ req, res });

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

  if (user.enrolledCourses.includes(courseId) === false)
    return res
      .status(401)
      .json({ error: "You are not enrolled in this course." });

  switch (method) {
    // GETS WHETHER QUIZ IS COMPLETED
    case "GET":
      return res.status(500).json({ TODO: `IMPLEMENT ME` });

    // SUBMITS QUIZ
    case "POST":
      let answers = req.body.answers;
      try {
        for (let i = 0; i < answers.length; i++) {
          answers[i] = validator.checkInt(answers[i]);
        }
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      let result;
      try {
        result = await lessonData.gradeQuiz(lesson._id.toString(), answers);
        if (result) {
          await lessonData.toggleQuizCompletedUsers(
            user.username,
            lesson._id.toString()
          );
        }
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      return res.status(200).json({ result });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
