import type { NextApiRequest, NextApiResponse } from "next";
import { validator } from "@/data/helpers/index.ts";
import { userData } from "@/data";
import { User } from "@/types";
import auth from "@/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // check if user is signed in
  const session = (await auth.getSession({ req, res })) as any;
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be signed in to interact with discussions." });

  // retrieve session user data
  let user;
  try {
    user = (await userData.getUser(session.username)) as User;
  } catch (e) {
    return res.status(404).json({ error: "User not found." });
  }

  const method = req.method;
  // changes a user's application status, session user must be admin
  if (method === "POST") {
    try {
      // validate parameters
      let { status } = req.body;
      status = validator.checkStatus(status, "status");
      let usernameToChange = req.query.username;
      usernameToChange = validator.checkUsername(
        usernameToChange,
        "usernameToChange"
      ) as string;

      // validate current session user is an admin
      if (!user.admin) {
        return res
          .status(403)
          .json({
            error: "You must be an admin to change application statuses",
          });
      }

      // make call to backend
      let result = await userData.setApplicationStatus(
        usernameToChange,
        status
      );
      return res.status(200).json({ user: result });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  // set a user's application back to null
  if (method === "DELETE") {
    try {
      // validate parameters
      let usernameToChange = req.query.username;
      usernameToChange = validator.checkUsername(
        usernameToChange,
        "usernameToChange"
      ) as string;

      // validate current session user is an admin or specified user
      if (!(user.admin || user.username === usernameToChange)) {
        return res
          .status(403)
          .json({
            error: "You must be an admin or the specified user to delete application",
          });
      }

      // make call to backend
      let result = await userData.deleteApplication(
        usernameToChange
      );
      return res.status(200).json({ user: result });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
