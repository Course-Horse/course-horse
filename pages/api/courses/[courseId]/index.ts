import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  const session = await getSession({ req });

  // GET SINGLE COURSE
  if (method === "GET") {
    return res.status(500).json({ TODO: `IMPLEMENT ME` });
  }

  // UPDATE COURSE INFO
  if (method === "POST") {
    return res.status(500).json({ TODO: `IMPLEMENT ME` });
  }

  // DELETE COURSE
  if (method === "DELETE") {
    return res.status(500).json({ TODO: `IMPLEMENT ME` });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}