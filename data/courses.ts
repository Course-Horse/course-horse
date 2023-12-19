import { courses, users } from "@/config/mongoCollections.js";
import { mongo, validator } from "@/data/helpers/index.ts";
import { Course, User, CourseUpdate } from "@/types";
import { lessonData, userData } from "@/data";

const methods = {
  /**
   * Gets an array of courses
   * @param {string} title string to filter the courses by [title]
   * @param {string} sortBy [created, title]
   * @param {boolean} sortOrder [true: ascending, false: descending]
   * @param {string[]} tagsFilter array of tags to filter by
   * @returns {Promise<Course[]>} Promise object that resolves to an array of courses
   */
  async getCourses(
    title?: string,
    sortBy?: string,
    sortOrder?: boolean,
    tags?: string[]
  ): Promise<Course[]> {
    const query: any = {};
    const sortOptions: any = {};

    // filter by title if provided
    if (title) {
      query.title = { $regex: new RegExp(title, "i") };
    }

    // filter by tags if provided
    if (tags && tags.length > 0) {
      query["tags"] = { $in: tags };
    }

    // set sortBy and sortOrder parameters if provided
    if (sortBy === "created") {
      sortOptions["created"] = sortOrder ? 1 : -1;
    } else if (sortBy === "title") {
      sortOptions.title = sortOrder ? 1 : -1;
    }

    // query and sort data from the database
    const coursesCollection = await courses();
    const coursesList = await coursesCollection
      .find(query)
      .sort(sortOptions)
      .toArray();

    return coursesList;
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
   * Gets all courses made by a specific username
   * @param {string} username of user to get all made courses for
   * @returns {Promise} Promise object that resolves to an array of course objects
   */
  async getCoursesCreatedByUsername(username: string): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // return all courses created by specified username
    const coursesCollection = await courses();
    const coursesCreatedByUser = await coursesCollection
      .find({ creator: username })
      .toArray();
    return coursesCreatedByUser;
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
    username = validator.checkUsername(username, "username");
    let user = (await userData.getUser(username)) as User;
    if (
      !(user.application && user.application.status === "accepted") &&
      !user.admin
    ) {
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
      creator: username,
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
    const usersCollection = await users();
    await usersCollection.updateMany(
      { enrolledCourses: id },
      { $pull: { enrolledCourses: id } }
    );

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
