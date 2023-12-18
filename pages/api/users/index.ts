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
  switch (method) {
    // GET SESSION'S USER DATA
    case "GET":
      // check if user is signed in
      if (!session.username)
        return res.status(401).json({ error: "Unauthorized" });

      // get user data
      let user;
      try {
        user = await userData.getUser(session.username);
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      delete user.password;
      return res.status(200).json(user);

    // CREATE NEW USER
    case "POST":
      // get and validate input data
      let username;
      let password;
      let email;
      let firstName;
      let lastName;
      try {
        username = validator.checkUsername(req.body.username, "username");
        password = validator.checkPassword(req.body.password, "password");
        email = validator.checkEmail(req.body.email, "email");
        firstName = validator.checkName(req.body.firstName, "firstName");
        lastName = validator.checkName(req.body.lastName, "lastName");
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      // attempt to create new user
      let result;
      try {
        result = await userData.createUser(
          username,
          password,
          email,
          firstName,
          lastName
        );
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      return res.status(200).json(result);
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
