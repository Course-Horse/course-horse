import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { userData, courseData } from "@/data";
import { mongo, validator } from "@/data/helpers";
import { Course, User } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // check if user is signed in
  const session = (await auth.getSession({ req, res })) as any;
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be signed in to rearrange lessons" });

  // get user data
  let user;
  try {
    user = (await userData.getUser(session.username)) as User;
  } catch (e) {
    return res.status(404).json({ error: "User not found." });
  }
  // validate course id
  let courseId = req.query.courseId as string;
  try {
    courseId = mongo.checkId(courseId, "courseId");
  } catch (e) {
    return res.status(400).json({ error: "Invalid course ID." });
  }
  // get course
  let course;
  try {
    course = (await courseData.getCourse(courseId)) as Course;
  } catch (e) {
    return res.status(404).json({ error: "course not found" });
  }
  const method = req.method;
  // rearrange lessons for a specific course
  if (method === "POST") {
    // validate lesson ids
    let { lessons } = req.body;
    for (let i = 0; i < lessons.length; i++) {
      try {
        lessons[i] = mongo.checkId(lessons[i], "lesson id");
      } catch (e) {
        return res.status(400).json({ error: e });
      }
    }
    // check if current session's user is the creator of the course or an admin
    if (session.username !== course.creator && !user.admin) {
      return res.status(403).json({
        error: "You must be the creator of the course to rearrange the lessons",
      });
    }
    // rearrange lessons
    let result;
    try {
      result = await courseData.rearrangeLessons(
        course._id.toString(),
        lessons
      );
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return res.status(200).json({ course: result });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
