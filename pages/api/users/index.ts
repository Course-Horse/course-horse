import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { userData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const method = req.method;
  const session = await getSession({ req });

  if (method === "GET") {
    if (!session) return res.status(401).json({ error: "Unauthorized" });
    let user;
    try {
      user = await userData.getUser(session.user.name);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
    if (user.type !== "admin")
      return res.status(401).json({ error: "Unauthorized" });

    let result = await userData.getUsers();
    return res.status(200).json(result);
  }

  if (method === "POST") {
    // TODO: check for and validate body fields
    console.log(req.body);
    let result;
    try {
      await userData.createUser(
        req.body.username,
        req.body.password,
        req.body.email,
        req.body.firstName,
        req.body.lastName
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    return res.status(200).json(result);
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
