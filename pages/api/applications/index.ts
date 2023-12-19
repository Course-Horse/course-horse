import type { NextApiRequest, NextApiResponse } from "next";
import { validator } from "@/data/helpers/index.ts";
import { userData } from "@/data";
import { QueryParams } from "@/types";
import auth from "@/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  const session = await auth.getSession({ req, res });

  if (method === "GET") {
    let { usernameQuery, sortBy, sortOrder, statusFilter } = req.query;
    let applicationParams: QueryParams = {};

    // validate user inputs
    try {
      if (usernameQuery) {
        applicationParams.usernameQuery = validator.checkString(
          usernameQuery,
          "usernameQuery"
        );
      }
      if (sortBy) {
        applicationParams.sortBy = validator.checkSortByApplication(
          sortBy,
          "sortBy"
        );
      }
      if (sortOrder) {
        let resultOrder = validator.checkSortOrder(sortOrder, "sortOrder");
        applicationParams.sortOrder = resultOrder === "asc" ? true : false;
      }
      if (statusFilter) {
        applicationParams.statusFilter = validator.checkStringArray(
          JSON.parse(statusFilter as any),
          "statusFilter"
        );
        if (applicationParams.statusFilter.length === 0) {
          delete applicationParams.statusFilter;
        }
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    console.log(applicationParams);

    // make call to backend
    let result;
    try {
      result = await userData.getApplications(
        applicationParams.usernameQuery,
        applicationParams.sortBy,
        applicationParams.sortOrder,
        applicationParams.statusFilter
      );
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    return res.status(200).json({ users: result });
  }

  if (method === "POST") {
    return res.status(500).json({ TODO: `IMPLEMENT ME` });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
