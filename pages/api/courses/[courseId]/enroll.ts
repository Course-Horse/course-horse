import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { mongo } from "@/data/helpers";
import { userData, courseData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  const session = (await auth.getSession({ req, res })) as any;
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

  let enrolled;
  switch (method) {
    // gets current enrollment status
    case "GET":
      let user = await userData.getUser(session.username);
      enrolled = false;
      if (user.enrolledCourses.includes(courseId.toString())) enrolled = true;
      return res.status(200).json({ enrolled });

    // TOGGLES ENROLLMENT IN COURSE
    case "POST":
      let result;
      try {
        result = await userData.toggleEnrollment(
          session.username,
          courseId.toString()
        );
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      enrolled = false;
      if (result.enrolledCourses.includes(courseId.toString())) enrolled = true;
      return res.status(200).json({ enrolled });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
