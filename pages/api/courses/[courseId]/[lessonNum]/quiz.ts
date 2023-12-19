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
      .json({ error: "You must be signed in to interact with quizes." });

  // get user data
  let user;
  try {
    user = await userData.getUser(session.username);
  } catch (e) {
    return res.status(404).json({ error: "User not found." });
  }

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
    return res.status(400).json({ error: "Invalid lesson number." });

  // get lesson
  let lesson;
  try {
    lesson = await lessonData.getLesson(course.lessons[lessonNum].toString());
  } catch (e) {
    return res.status(404).json({ error: "Lesson not found." });
  }

  // check if user is enrolled in course
  if (!user.enrolledCourses.includes(courseId))
    return res
      .status(403)
      .json({ error: "You are not enrolled in this course." });

  const method = req.method;
  // SUBMIT QUIZ
  if (method === "POST") {
    // check if quiz is already completed
    if (lesson.quiz.completed.includes(user.username))
      return res.status(403).json({ error: "Quiz already completed." });

    // get and validate answers
    let answers = req.body.answers;
    try {
      for (let i = 0; i < answers.length; i++) {
        answers[i] = validator.checkInt(answers[i]);
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // grade quiz
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

    // return passing result
    return res.status(200).json({ result });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
