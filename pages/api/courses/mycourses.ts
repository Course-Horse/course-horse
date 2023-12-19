import type { NextApiRequest, NextApiResponse } from "next";

import auth from "@/auth";
import { userData, courseData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = (await auth.getSession({ req, res })) as any;
  // check if user is signed in
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be signed in to access this route." });

  const method = req.method;
  // GET COURSES THE CURRENT SESSION USER CREATED AND IS ENROLLED IN
  if (method === "GET") {
    // get courses the user is enrolled in
    let enrolled;
    try {
      enrolled = await userData.getUser(session.username);
      enrolled = enrolled.enrolledCourses;
      for (let i = 0; i < enrolled.length; i++) {
        enrolled[i] = await courseData.getCourse(enrolled[i].toString());
      }
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    // get courses the user created
    let creator;
    try {
      creator = await courseData.getCoursesCreatedByUsername(session.username);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    // return courses
    let result = {
      enrolled,
      creator,
    };
    return res.status(200).json(result);
  }

  return res
    .status(405)
    .json({ error: `${method} method is not supported on this route.` });
}
