import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { validator } from "@/data/helpers";
import { courseData } from "@/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  const session = (await auth.getSession({ req, res })) as any;

  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be logged in to interact with courses." });

  switch (method) {
    // GET LIST OF COURSES
    case "GET":
      let courses;
      let thisTitle = req.query.title as any;
      let thisSortBy = req.query.sortBy as any;
      let thisSortOrder = req.query.sortOrder === "desc" ? false : true;
      let thisTags =
        req.query.tags !== undefined
          ? JSON.parse(req.query.tags as any)
          : undefined;

      try {
        courses = await courseData.getCourses(
          thisTitle,
          thisSortBy,
          thisSortOrder,
          thisTags
        );
      } catch (e) {
        return res.status(500).json({ error: e });
      }
      return res.status(200).json(courses.splice(0, 20));

    // CREATE COURSE
    case "POST":
      console.log(req.body);
      let { title, description, coursePicture, tags } = req.body;
      try {
        title = validator.checkString(title, "title");
        description = validator.checkString(description, "description");
        coursePicture = validator.checkImage(coursePicture, "coursePicture");
        tags = validator.checkStringArray(tags, "tags");
      } catch (e) {
        res.status(400).json({ error: e });
      }

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
        console.log(e);
        res.status(500).json({ error: e });
      }

      return res.status(200).json(result);
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
