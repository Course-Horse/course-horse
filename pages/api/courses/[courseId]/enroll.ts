import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { mongo } from "@/data/helpers";
import { userData, courseData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // check if user is signed in
  const session = (await auth.getSession({ req, res })) as any;
  if (!session.username)
    return res.status(401).json({
      error: "You must be signed in to interact with course enrollment.",
    });

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
  // GET CURRENT ENROLLMENT STATUS
  if (method === "GET") {
    // get user data
    let user = await userData.getUser(session.username);

    // return enrollment status
    let enrolled = false;
    if (user.enrolledCourses.includes(courseId.toString())) enrolled = true;
    return res.status(200).json({ enrolled });
  }

  // TOGGLE ENROLLMENT IN COURSE
  if (method === "POST") {
    // run toggleEnrollment function
    let result;
    try {
      result = await userData.toggleEnrollment(
        session.username,
        courseId.toString()
      );
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    // return enrollment status
    let enrolled = false;
    if (result.enrolledCourses.includes(courseId.toString())) enrolled = true;
    return res.status(200).json({ enrolled });
  }

  return res
    .status(405)
    .json({ error: `${method} method is not supported on this route.` });
}
