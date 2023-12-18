import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  const session = await auth.getSession({ req });

  switch (method) {
    // GETS LIST OF YOUR CREATED AND ENROLLED COURSES
    case "GET":
      return res.status(500).json({ TODO: `IMPLEMENT ME` });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
