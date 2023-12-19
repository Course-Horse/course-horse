import type { NextApiRequest, NextApiResponse } from "next";

import auth from "@/auth";
import { validator } from "@/data/helpers";
import { userData } from "@/data";
import seeding from "@/seed.ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (process.env.ALLOW_SEED === "false")
    return res
      .status(403)
      .json({ error: "Seeding is not allowed on this server." });
  await seeding();
  res.status(200).json({ Seeded: "Yes!" });
}
