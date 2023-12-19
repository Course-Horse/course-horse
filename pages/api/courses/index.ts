import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { validator } from "@/data/helpers";
import { courseData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = (await auth.getSession({ req, res })) as any;
  // check if user is signed in
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be signed in to interact with courses." });

  const method = req.method;
  // GET COURSES FROM ALL COURSES
  if (method === "GET") {
    // get user inputs
    let { title, sortBy, sortOrder, tags } = req.query as any;
    try {
      title = !title ? undefined : validator.checkString(title, "title");
      sortBy = !sortBy
        ? undefined
        : validator.checkSortByCourse(sortBy, "sortBy");
      sortOrder = !sortOrder
        ? undefined
        : validator.checkSortOrder(sortOrder, "sortOrder");
      sortOrder = sortOrder === "desc" ? false : true;
      tags = !tags
        ? undefined
        : validator.checkTagList(JSON.parse(req.query.tags as any), "tags");
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    // get courses given the query parameters
    let courses;
    try {
      courses = await courseData.getCourses(title, sortBy, sortOrder, tags);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
    // TODO: maybe look into pagination
    courses = courses.splice(0, 20);

    // return courses
    return res.status(200).json(courses);
  }

  // CREATE A COURSE
  if (method === "POST") {
    // get user inputs
    let { title, description, coursePicture, tags } = req.body;
    try {
      title = validator.checkString(title, "title");
      description = validator.checkString(description, "description");
      coursePicture = validator.checkImage(coursePicture, "coursePicture");
      tags = validator.checkStringArray(tags, "tags");
    } catch (e) {
      res.status(400).json({ error: e });
    }

    // attempt to create course
    let result;
    try {
      result = await courseData.createCourse(
        session.username,
        title,
        description,
        coursePicture,
        tags
      );
    } catch (e) {
      res.status(500).json({ error: e });
    }

    // return result
    return res.status(200).json(result);
  }

  return res
    .status(405)
    .json({ error: `${method} method is not supported on this route.` });
}
