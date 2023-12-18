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
  console.log(session);

  if (method === "GET") {
    if (!session) return res.status(401).json({ error: "Unauthorized" });
    let user;
    try {
      user = await userData.getUser(session.user.name);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    delete user.password;
    return res.status(200).json(user);
  }

  if (method === "POST") {
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
