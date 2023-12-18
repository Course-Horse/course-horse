import { courses, users } from "@/config/mongoCollections.js";
import { mongo, validator } from "@/data/helpers/index.ts";
import { Course, User } from "@/types";

const methods = {
  async getCourses() {
    return "IMPLEMENT ME";
  },

  async getCourse(id: string) {
    return "IMPLEMENT ME";
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
      lessons: []
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
