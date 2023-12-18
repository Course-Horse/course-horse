import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { validator } from "@/data/helpers";
import { userData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.query.method;
  if (method === null)
    return res.status(400).json({ error: "No method specified" });

  const session = await getSession({ req });

  if (method === "GET") {
    return res.status(200).json({ TODO: "TODO" });
  }

  if (method === "POST") {
    // check if user is actually the right user
    if (session.user?.name !== req.query.username)
      return res.status(403).json({ error: "You cannot update another user." });

    // get type of update
    let updateType = req.query.updateType;
    if (
      !updateType ||
      !["personal", "password", "picture"].includes(updateType)
    )
      return res.status(400).json({ error: "Invalid update type" });

    let result;
    // update personal info
    if (updateType === "personal") {
      let firstName = req.query.firstName;
      let lastName = req.query.lastName;
      let email = req.query.email;
      try {
        firstName = validator.checkName(firstName, "firstName");
        lastName = validator.checkName(lastName, "lastName");
        email = validator.checkEmail(email, "email");
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      try {
        result = await userData.updateUser(session.user.name, {
          firstName,
          lastName,
          email,
        });
        delete result.password;
      } catch (e) {
        return res.status(500).json({ error: e });
      }
    }

    // update password
    if (updateType === "password") {
      let password = req.query.password;
      try {
        password = validator.checkPassword(password, "password");
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      try {
        result = await userData.updateUser(session.user.name, { password });
        delete result.password;
      } catch (e) {
        return res.status(500).json({ error: e });
      }
    }

    // update picture
    if (updateType === "picture") {
      // let picture = req.query.picture;
      console.log(req.body);
    }

    return res.status(200).json(result);
  }
  res.status(200).json({ TODO: "TODO" });

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
