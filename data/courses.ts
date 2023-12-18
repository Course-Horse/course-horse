import { courses, users } from "@/config/mongoCollections.js";
import { mongo, validator } from "@/data/helpers/index.ts";
import { Course, User, CourseUpdate } from "@/types";
import { lessonData } from "@/data";

const methods = {
  /**
   * Gets an array of all courses
   * @returns {Promise} Promise object that resolves to an array of all courses
   */
  async getCourses(): Promise<any> {
    let result = await mongo.getAllDocs(courses);
    return result;
  },

  /**
   * Gets a specific course by id
   * @param {string} id of course to get
   * @returns {Promise} Promise object that resolves to a course object
   */
  async getCourse(id: string): Promise<any> {
    // validate id
    id = mongo.checkId(id, "id");

    // retrieve course with specified id from the database
    let result = (await mongo.getDocById(courses, id, "id")) as Course;
    return result;
  },

  /**
   * Creates a new course in database
   * @param {string} educatorId
   * @param {string} title
   * @param {string} description
   * @param {string} coursePicture
   * @param {string[]} tags
   * @returns {Promise} Promise object that resolves to a course object
   */
  async createCourse(
    educatorId: string,
    title: string,
    description: string,
    coursePicture: string,
    tags: string[]
  ) {
    // validate educatorId and check if user is a valid educator
    educatorId = mongo.checkId(educatorId, "educatorId");
    let user = (await mongo.getDocById(users, educatorId, "user")) as User;
    if (!(user.application && user.application.status === "accepted")) {
      throw "user must be an educator to create a course";
    }

    // validate title
    title = validator.checkString(title, "title");

    // validate description
    description = validator.checkString(description, "description");

    // validate coursePicture
    coursePicture = validator.checkImage(coursePicture, "coursePicture");

    // validate tags
    tags = validator.checkStringArray(tags, "tags");

    // create course object
    let course = {
      educatorId: educatorId,
      title: title,
      description: description,
      coursePicture: coursePicture,
      tags: tags,
      created: new Date(),
      lessons: [],
    };

    // add course object to database using mongo helper functions
    let result = (await mongo.createDoc(courses, course, "course")) as Course;
    return result;
  },

  /**
   * Updates a course
   * @param {string} id of the course to update
   * @param {object} fields Object whos fields correspond to the fields to update
   * @returns {Promise} Promise object that resolves to a course object
   */
  async updateCourse(id: string, fields: CourseUpdate): Promise<any> {
    // validate id
    id = mongo.checkId(id, "id");

    // retrieve course with specified id from the database
    let new_course = (await mongo.getDocById(courses, id, "id")) as Course;

    // validate title
    if (fields.hasOwnProperty("title")) {
      new_course.title = validator.checkString(fields.title, "title");
    }

    // validate description
    if (fields.hasOwnProperty("description")) {
      new_course.description = validator.checkString(
        fields.description,
        "description"
      );
    }

    // validate coursePicture
    if (fields.hasOwnProperty("coursePicture")) {
      new_course.coursePicture = validator.checkImage(
        fields.coursePicture,
        "coursePicture"
      );
    }

    // validate tags
    if (fields.hasOwnProperty("tags")) {
      new_course.tags = validator.checkStringArray(fields.tags, "tags");
    }

    // update course in database using mongo helper functions
    let result = (await mongo.replaceDocById(
      courses,
      new_course._id.toString(),
      new_course,
      "course"
    )) as Course;
    return result;
  },

  /**
   * Deletes a course
   * @param {string} id of the course to delete
   * @returns {Promise} Promise object that resolves to a course object
   */
  async deleteCourse(id: string): Promise<any> {
    // validate id
    id = mongo.checkId(id, "id");

    // retrieve course with specified id from the database
    let course = (await mongo.getDocById(courses, id, "id")) as Course;

    // delete all lessons within course
    let lessonIdsToDelete = course.lessons;
    for (const lessonId of lessonIdsToDelete) {
      lessonData.deleteLesson(lessonId);
    }

    // remove courseId from all user's enrolledCourses

    // delete course from database using mongo helper functions
    let deleted_course = (await mongo.deleteDocById(
      courses,
      id,
      "course"
    )) as Course;
    return deleted_course;
  },
};

export default methods;
