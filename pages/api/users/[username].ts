import type { NextApiRequest, NextApiResponse } from "next";

import auth from "@/auth";
import { validator } from "@/data/helpers";
import { userData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  const session = await auth.getSession({ req, res });
  console.log(session);

  switch (method) {
    case "GET":
      // GET PUBLIC USER DATA
      return res.status(200).json({ TODO: "TODO" });
    case "POST":
      // UPDATE USER DATA
      // check if user authorized to update the user
      if (session.username !== req.query.username)
        return res
          .status(403)
          .json({ error: "You cannot update another user." });

      // get type of update
      const updateType = req.body.updateType;

      let result;
      switch (updateType) {
        case "personal":
          // get and validate input data
          let firstName = req.body.firstName;
          let lastName = req.body.lastName;
          let email = req.body.email;
          try {
            firstName = validator.checkName(firstName, "firstName");
            lastName = validator.checkName(lastName, "lastName");
            email = validator.checkEmail(email, "email");
          } catch (e) {
            return res.status(400).json({ error: e });
          }

          // attempt to update user
          try {
            result = await userData.updateUser(session.username, {
              firstName,
              lastName,
              email,
            });
            delete result.password;
          } catch (e) {
            return res.status(500).json({ error: e });
          }
          return res.status(200).json(result);

        case "password":
          // get and validate input data
          let password = req.body.password;
          try {
            password = validator.checkPassword(password, "password");
          } catch (e) {
            return res.status(400).json({ error: e });
          }

          // attempt to update user
          try {
            result = await userData.updateUser(session.username, { password });
            delete result.password;
          } catch (e) {
            return res.status(500).json({ error: e });
          }
          return res.status(200).json(result);

        case "picture":
          return res.status(501).json({ error: "Not implemented" });
      }
      return res.status(400).json({ error: "Invalid update type" });
  }

  return res
    .status(404)
    .json({ error: `${method} method is not supported on this route.` });
}
