import type { NextApiRequest, NextApiResponse } from "next";

import auth from "@/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  if (method === "GET") {
    const session = (await auth.getSession({ req, res })) as any;
    let username = session.username;
    if (!username)
      return res
        .status(401)
        .json({ error: "You must be signed in to signout." });
    await session.destroy();
    return res
      .status(200)
      .json({ message: `Successfully signed out of ${username}.` });
  }

  return res
    .status(405)
    .json({ error: `${method} method is not supported on this route.` });
}
