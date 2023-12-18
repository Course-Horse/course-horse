import type { NextApiRequest, NextApiResponse } from "next";

import auth from "@/auth";
import { validator } from "@/data/helpers";
import { userData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  switch (method) {
    case "POST":
      let username = req.body.username;
      let password = req.body.password;

      try {
        username = validator.checkUsername(username, "username");
        password = validator.checkPassword(password, "password");
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      let result;
      try {
        result = await userData.authUser(username, password);
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      const session = await auth.getSession({ req, res });
      session.username = username;
      await session.save();

      return res
        .status(200)
        .json({ message: `Successfully logged into ${username}.` });
  }

  return res.status(404).json({ error: "Method not supported at this route." });
}