import { courses, users } from "@/config/mongoCollections.js";
import { mongo, validator } from "@/data/helpers/index.ts";
import { Course, User } from "@/types";
import { userData } from ".";

const methods = {
  async getCourses() {
    return "IMPLEMENT ME";
  },

  async getCourse(id: string) {
    return "IMPLEMENT ME";
  },

  /**
   * Creates a new course in database
   * @param {string} username
   * @param {string} title
   * @param {string} description
   * @param {string} coursePicture
   * @param {string[]} tags
   * @returns {Promise} Promise object that resolves to a course object
   */
  async createCourse(
    username: string,
    title: string,
    description: string,
    coursePicture: string,
    tags: string[]
  ) {
    // validate username and check if user is a valid educator
    username = validator.checkUsername(username, "educatorId");
    let user = (await userData.getUser(username)) as User;
    if (
      !(user.application && user.application.status === "accepted") &&
      !user.admin
    ) {
      throw "user must be an educator to create a course";
    }

    // validate other fields
    title = validator.checkString(title, "title");
    description = validator.checkString(description, "description");
    coursePicture = validator.checkImage(coursePicture, "coursePicture");
    tags = validator.checkStringArray(tags, "tags");

    // create course object
    let course = {
      educatorId: username,
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

  async updateCourse(id: string, fields: object) {
    return "IMPLEMENT ME";
  },

  async deleteCourse(id: string) {
    return "IMPLEMENT ME";
  },
};

export default methods;
