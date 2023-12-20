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
  // GET COMPLETED COURSES FOR THE CURRENT SESSION USER
  if (method === "GET") {
    let result = {} as any;
    try {
      result.completed = await userData.getCompletedCourses(session.username);
      result.tags = await userData.topCompletedTags(session.username);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
    return res.status(200).json(result);
  }

  return res
    .status(405)
    .json({ error: `${method} method is not supported on this route.` });
}
