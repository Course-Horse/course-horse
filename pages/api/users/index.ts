import type { NextApiRequest, NextApiResponse } from "next";

import auth from "@/auth";
import { validator } from "@/data/helpers";
import { userData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  const session = (await auth.getSession({ req, res })) as any;

  // GET USER DATA OF CURRENT SESSION
  if (method === "GET") {
    // check if user is signed in
    if (!session.username)
      return res
        .status(401)
        .json({ error: "You must be signed in to get your user data." });

    // get user data
    let user;
    try {
      user = await userData.getUser(session.username);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    delete user.password;
    return res.status(200).json(user);
  }

  // CREATE NEW USER
  if (method === "POST") {
    // check if user is signed in
    if (session.username)
      return res
        .status(401)
        .json({ error: "You must be signed out to create a new account." });

    // get and validate input data
    let { username, password, email, firstName, lastName } = req.body;
    try {
      username = validator.checkUsername(username, "username");
      password = validator.checkPassword(password, "password");
      email = validator.checkEmail(email, "email");
      firstName = validator.checkName(firstName, "firstName");
      lastName = validator.checkName(lastName, "lastName");
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
    .status(405)
    .json({ error: `${method} method is not supported on this route.` });
}
