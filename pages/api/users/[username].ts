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
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be signed in to interact with users." });

  // GET PUBLIC USER DATA
  if (method === "GET") {
    // get and validate username
    let username = req.query.username as string;
    try {
      username = validator.checkUsername(username, "username");
    } catch (e) {
      res.status(400).json({ error: e });
    }

    // attempt to get user data
    let user;
    try {
      user = await userData.getUser(username);
    } catch (e) {
      return res.status(404).json({ error: e });
    }

    // return public user data
    return res.status(200).json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  }

  // UPDATE USER DATA
  if (method === "POST") {
    // check if user authorized to update the user
    if (session.username !== req.query.username)
      return res.status(403).json({ error: "You cannot update another user." });

    const updateType = req.body.updateType;
    // UPDATE PERSONAL INFORMATION
    if (updateType === "personal") {
      // get and validate input data
      let { firstName, lastName, email } = req.body;
      try {
        firstName = validator.checkName(firstName, "firstName");
        lastName = validator.checkName(lastName, "lastName");
        email = validator.checkEmail(email, "email");
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      // attempt to update user personal info
      let result;
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

      // return updated user
      return res.status(200).json(result);
    }

    // UPDATE PASSWORD
    if (updateType === "password") {
      // get and validate input data
      let password = req.body.password;
      try {
        password = validator.checkPassword(password, "password");
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      // attempt to update user password
      let result;
      try {
        result = await userData.updateUser(session.username, { password });
        delete result.password;
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      // return updated user
      return res.status(200).json(result);
    }

    // UPDATE PROFILE PICTURE
    if (updateType === "picture") {
      let profilePicture = req.body.profilePicture;
      try {
        profilePicture = validator.checkImage(profilePicture, "profilePicture");
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      // attempt to update user profile picture
      let result;
      try {
        result = await userData.setProfilePicture(
          session.username,
          profilePicture
        );
        delete result.password;
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      // return updated user
      return res.status(200).json(result);
    }

    return res.status(400).json({ error: "Invalid update type" });
  }

  return res
    .status(405)
    .json({ error: `${method} method is not supported on this route.` });
}
