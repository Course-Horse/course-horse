import { lessons, courses, users } from "@/config/mongoCollections.js";
import { mongo, validator } from "@/data/helpers/index.ts";
import { Quiz, Lesson, Course, User } from "@/types";

const methods = {
  async getLessons(courseId: string) {
    return "IMPLEMENT ME";
  },

  async getLesson(lessonId: string) {
    lessonId = mongo.checkId(lessonId, "lessonId");

    let result = (await mongo.getDocById(
      lessons,
      lessonId,
      "lesson"
    )) as Lesson;

    return result;
  },

  /**
   * Creates a new lesson for a course in the database
   * @param {string} educatorId
   * @param {string} title
   * @param {string} description
   * @param {string} coursePicture
   * @param {string[]} tags
   * @returns {Promise} Promise object that resolves to a course object
   */
  async createLesson(
    courseId: string,
    title: string,
    description: string,
    content: string,
    videos: string[],
    quiz?: Quiz
  ) {
    // validate courseId
    courseId = mongo.checkId(courseId, "courseId");
    let parent_course = (await mongo.getDocById(
      courses,
      courseId,
      "course"
    )) as Course;

    // validate title
    title = validator.checkString(title, "title");

    // validate description
    description = validator.checkString(description, "description");

    // validate content
    content = validator.checkString(content, "content");

    // validate videos
    videos = validator.checkVideoStringArray(videos, "videos");

    // check for quiz
    let quiz_obj = quiz !== undefined ? quiz : null;

    // create lesson object
    let lesson = {
      courseId: courseId,
      title: title,
      description: description,
      content: content,
      videos: videos,
      created: new Date(),
      viewed: [],
      quiz: quiz_obj,
      discussion: [],
    };

    // add lesson object to database using mongo helper functions
    let result = (await mongo.createDoc(lessons, lesson, "lesson")) as Lesson;

    // update parent course's lessons array
    parent_course.lessons.push(result._id);
    await mongo.replaceDocById(courses, courseId, parent_course, "course");

    return result;
  },

  async deleteLesson(lessonId: string) {
    return "IMPLEMENT ME";
  },
};

export default methods;
