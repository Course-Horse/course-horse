import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/auth";
import { courseData, lessonData, userData } from "@/data";
import { mongo, validator } from "@/data/helpers";

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

  // get and validate course id
  let courseId = req.query.courseId as string;
  try {
    courseId = mongo.checkId(courseId);
  } catch (e) {
    return res.status(400).json({ error: "Invalid course ID." });
  }

  // get course
  let course;
  try {
    course = await courseData.getCourse(courseId);
  } catch (e) {
    return res.status(404).json({ error: "Course not found." });
  }

  const method = req.method;
  // GET COURSE DATA
  if (method === "GET") {
    // get user
    let user;
    try {
      user = await userData.getUser(session.username);
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Unable to get session user data." });
    }

    // if user is not creator or enrolled, delete lesson data
    if (
      session.username !== course.creator &&
      !user.enrolledCourses.includes(courseId)
    ) {
      delete course.lessons;
    }
    // Otherwise, get lesson data for each lesson in course
    else {
      for (let i = 0; i < course.lessons.length; i++) {
        course.lessons[i] = await lessonData.getLesson(
          course.lessons[i].toString()
        );
      }
    }

    // return course data
    return res.status(200).json(course);
  }

  // UPDATE COURSE
  if (method === "POST") {
    let updateType = req.body.updateType;
    // check if user is the creator
    if (session.username !== course.creator)
      return res
        .status(403)
        .json({ error: "You must be the creator to update a course." });

    // UPDATE BASIC COURSE INFO
    if (updateType === "basic") {
      // get and validate user inputs
      let { title, description, tags } = req.body;
      try {
        title = validator.checkString(title, "title");
        description = validator.checkString(description, "description");
        tags = validator.checkTagList(tags, "tags");
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      // update course
      let result;
      try {
        result = await courseData.updateCourse(courseId, {
          title,
          description,
          tags,
        });
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      // return updated course
      return res.status(200).json(result);
    }

    // UPDATE COURSE PICTURE
    if (updateType === "picture") {
      // get and validate user inputs
      let { coursePicture } = req.body;
      try {
        coursePicture = validator.checkImage(coursePicture, "coursePicture");
      } catch (e) {
        return res.status(400).json({ error: e });
      }

      // update course
      let result;
      try {
        result = await courseData.updateCourse(courseId, { coursePicture });
      } catch (e) {
        return res.status(500).json({ error: e });
      }

      // return updated course
      return res.status(200).json(result);
    }

    return res.status(400).json({ error: "Invalid update type." });
  }

  // DELETE COURSE
  if (method === "DELETE") {
    // check if user is the creator
    if (session.username !== course.creator)
      return res
        .status(403)
        .json({ error: "You must be the creator to delete a course." });

    // delete course
    try {
      await courseData.deleteCourse(courseId);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    // return success message
    return res.status(200).json({ success: `Course deleted.` });
  }

  return res
    .status(405)
    .json({ error: `${method} method is not supported on this route.` });
}
