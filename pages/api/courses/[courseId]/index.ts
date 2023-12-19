import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { courseData, lessonData } from "@/data";
import { mongo, validator } from "@/data/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const method = req.method;
  const session = await auth.getSession({ req, res });
  let courseId = req.query.courseId as string;
  if (!session.username)
    return res
      .status(401)
      .json({ error: "You must be signed in to interact with courses." });

  try {
    courseId = mongo.checkId(courseId);
  } catch (e) {
    return res.status(400).json({ error: "Invalid course ID." });
  }

  let course;
  try {
    course = await courseData.getCourse(courseId);
  } catch (e) {
    return res.status(404).json({ error: "Course not found." });
  }

  let result;
  switch (method) {
    // GET SINGLE COURSE
    case "GET":
      for (let i = 0; i < course.lessons.length; i++) {
        course.lessons[i] = await lessonData.getLesson(
          course.lessons[i].toString()
        );
      }
      return res.status(200).json(course);

    // UPDATE COURSE INFO
    case "POST":
      let updateType = req.body.updateType;
      let result;
      switch (updateType) {
        case "basic":
          let { title, description, tags } = req.body;
          try {
            title = validator.checkString(title, "title");
            description = validator.checkString(description, "description");
            tags = validator.checkStringArray(tags, "tags");
          } catch (e) {
            return res.status(400).json({ error: e });
          }
          const update = {
            title,
            description,
            tags,
          };

          try {
            result = await courseData.updateCourse(courseId, update);
          } catch (e) {
            return res.status(500).json({ error: `Failed to update course.` });
          }

          return res.status(200).json(result);

        case "picture":
          let { coursePicture } = req.body;
          try {
            coursePicture = validator.checkImage(
              coursePicture,
              "coursePicture"
            );
          } catch (e) {
            return res.status(400).json({ error: e });
          }
          const update2 = {
            coursePicture,
          };

          try {
            result = await courseData.updateCourse(courseId, update2);
          } catch (e) {
            return res.status(500).json({ error: `Failed to update course.` });
          }
          return res.status(200).json(result);
      }
      return res.status(400).json({ error: "Invalid update type." });

    // DELETE COURSE
    case "DELETE":
      if (session.username !== course.creator)
        return res
          .status(401)
          .json({ error: "You must be the creator to delete a course." });

      try {
        await courseData.deleteCourse(courseId);
      } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
      }

      return res.status(200).json({ success: `Course deleted.` });
  }

  return res
    .status(404)
    .json({ error: `${req.method} method is not supported on this route.` });
}
