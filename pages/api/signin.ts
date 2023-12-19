import type { NextApiRequest, NextApiResponse } from "next";

import auth from "@/auth";
import { validator } from "@/data/helpers";
import { userData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = (await auth.getSession({ req, res })) as any;
  const method = req.method;

  if (method === "POST") {
    // check if user is signed in
    if (session.username)
      return res
        .status(401)
        .json({ error: "You must be signed out to signin." });

    // get and validate username and password
    let { username, password } = req.body;
    try {
      username = validator.checkUsername(username, "username");
      password = validator.checkPassword(password, "password");
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // attempt to authenticate user
    let result;
    try {
      result = await userData.authUser(username, password);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    // save session and return
    session.username = username;
    await session.save();
    return res
      .status(200)
      .json({ message: `Successfully logged into ${username}.` });
  }

  return res
    .status(405)
    .json({ error: `${method} method is not supported on this route.` });
}
