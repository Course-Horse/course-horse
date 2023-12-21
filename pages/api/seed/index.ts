import type { NextApiRequest, NextApiResponse } from "next";

import auth from "@/auth";
import { validator } from "@/data/helpers";
import { userData } from "@/data";
import seeding from "@/seed.ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (process.env.ALLOW_SEED !== "true")
    return res
      .status(403)
      .json({ error: "Seeding is not allowed on this server." });
  try {
    await seeding();
  } catch (e) {
    return res.status(500).json({ error: e });
  }

  res.status(200).json({ Seeded: "Yes!" });
}
