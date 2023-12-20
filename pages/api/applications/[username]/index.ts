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
    return res.status(500).json({ error: "Unable to get session user data." });
  }

  // get and validate username to change
  let usernameToChange = req.query.username;
  try {
    usernameToChange = validator.checkUsername(
      usernameToChange,
      "usernameToChange"
    ) as string;
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  const method = req.method;
  // CHANGE APPLICATION STATUS (session user must be admin)
  if (method === "POST") {
    // get and validate user inputs
    let { status } = req.body;
    try {
      status = validator.checkStatus(status, "status");
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // check if session user is an admin
    if (!user.admin) {
      return res.status(403).json({
        error: "You must be an admin to change application statuses",
      });
    }

    // attempt to change application status
    let result;
    try {
      result = await userData.setApplicationStatus(usernameToChange, status);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    // return updated user
    return res.status(200).json({ user: result });
  }

  // DELETE AN APPLICATION (session user must be admin or specified user)
  if (method === "DELETE") {
    // check if session user is an admin or the specified user
    if (!(user.admin || user.username === usernameToChange)) {
      return res.status(403).json({
        error:
          "You must be an admin or the specified user to delete application",
      });
    }

    // attempt to delete application
    let result;
    try {
      result = await userData.deleteApplication(usernameToChange);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    // return updated user
    return res.status(200).json({ user: result });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
