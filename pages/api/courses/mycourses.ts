import type { NextApiRequest, NextApiResponse } from "next";

import auth from "@/auth";
import { userData, courseData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = (await auth.getSession({ req, res })) as any;
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be logged in to create a course." });

  let user;
  try {
    user = await userData.getUser(session.username);
  } catch (e) {
    return res.status(500).json({ error: e });
  }

  const method = req.method;
  let result;
  switch (method) {
    // GETS LIST OF YOUR CREATED AND ENROLLED COURSES
    case "GET":
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

      let creator;
      try {
        creator = await courseData.getCoursesCreatedByUsername(
          session.username
        );
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      result = {
        enrolled,
        creator,
      };

      return res.status(200).json(result);
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
