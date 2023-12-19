import type { NextApiRequest, NextApiResponse } from "next";
import { validator } from "@/data/helpers/index.ts";
import { userData } from "@/data";
import { QueryParams } from "@/types";
import auth from "@/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // check if user is signed in
  const session = (await auth.getSession({ req, res })) as any;
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be signed in to interact with discussions." });

  const method = req.method;
  // GET A LIST OF APPLICATIONS
  if (method === "GET") {
    // get and validate user inputs
    let { usernameQuery, sortBy, sortOrder, statusFilter } = req.query;
    let applicationParams: QueryParams = {};
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

    // attempt to get applications
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

    // return list of applications
    return res.status(200).json({ users: result });
  }

  // CREATE A NEW APPLICATION
  if (method === "POST") {
    // get and validate user inputs
    let { content, documents } = req.body;
    try {
      content = validator.checkString(content, "content");
      documents = validator.checkLinkStringArray(documents, "documents");
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // get user
    let user;
    try {
      user = await userData.getUser(session.username);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    // check if user already has a pending or accepted application
    if (user.application) {
      if (user.application.status === "pending") {
        return res.status(403).json({
          error: "You already have a pending application.",
        });
      } else if (user.application.status === "accepted") {
        return res.status(403).json({
          error: "You already have an accepted application.",
        });
      }
    }

    // attempt to create application
    let result;
    try {
      result = await userData.createApplication(
        session.username,
        content,
        documents
      );
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    // return new user with new application
    return res.status(200).json({ user: result });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
