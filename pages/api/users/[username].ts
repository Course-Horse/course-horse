import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { userData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  const session = await getSession({ req });

  if (method === "GET") {
    return res.status(200).json({ TODO: "TODO" });
  }

  if (method === "POST") {
    return res.status(200).json({ TODO: "TODO" });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
