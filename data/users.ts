import { courses, users, lessons } from "@/config/mongoCollections.js";
import { mongo, validator } from "@/data/helpers/index.ts";
import { Lesson, Course, User, UserUpdate } from "@/types";
const bcrypt = require("bcrypt");

const methods = {
  /**
   * Gets an array of all users
   * @returns {Promise} Promise object that resolves to an array of all users
   */
  async getUsers(): Promise<any> {
    let result = await mongo.getAllDocs(users);
    return result;
  },

  /**
   * Gets a user by username
   * @param {string} username of the user to get
   * @returns {Promise} Promise object that resolves to a user object
   */
  async getUser(username: string): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // get user from database using mongo helper functions
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;
    delete user.password;
    return user;
  },

  /**
   * Checks if user credientials are valid
   * @param {string} username of the user to authenticate
   * @param {string} password of the user to authenticate
   * @returns {Promise} Promise object that resolves to a user object
   */
  async authUser(username: string, password: string): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // validate password
    password = validator.checkPassword(password, "password");

    // retrieve specified user and check for matching passwords
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;
    let comparison = await bcrypt.compare(password, user.password);
    if (!comparison) throw "Invalid credentials.";

    delete user.password;
    return user;
  },

  /**
   * Creates a new user in the database
   * @param {string} username of the user to create
   * @param {string} password of the user to create
   * @param {string} email of the user to create
   * @param {string} firstName of the user to create
   * @param {string} lastName of the user to create
   * @returns {Promise} Promise object that resolves to a user object
   */
  async createUser(
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
  ): Promise<any> {
    // validate username and check if username already exists
    username = validator.checkUsername(username, "username");
    let usernameTaken = false;
    try {
      await mongo.getDocByParam(users, "username", username, "user");
      usernameTaken = true;
    } catch (e) {}
    if (usernameTaken) {
      throw "username taken";
    }

    // validate password
    password = validator.checkPassword(password, "password");

    // validate email and make sure email hasn't already been taken
    email = validator.checkEmail(email, "email");
    let emailTaken = false;
    try {
      await mongo.getDocByParam(users, "email", email, "email");
      emailTaken = true;
    } catch (e) {}
    if (emailTaken) {
      throw "email taken";
    }

    // validate first name
    firstName = validator.checkName(firstName, "first name");

    // validate last name
    lastName = validator.checkName(lastName, "last name");

    // encrypt password with specified salt rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create user object
    let user = {
      username: username,
      password: hashedPassword,
      email: email,
      firstName: firstName,
      lastName: lastName,
      profilePicture: "/default_profile.jpeg",
      bio: "",
      created: new Date(),
      admin: false,
      enrolledCourses: [],
      application: null,
    };

    // add user object to database using mongo helper functions
    let result = (await mongo.createDoc(users, user, "user")) as User;
    delete result.password;
    return result;
  },

  /**
   * Updates a user
   * @param {string} username of the user to update
   * @param {object} fields Object whos fields correspond to the fields to update
   * @returns {Promise} Promise object that resolves to a user object
   */
  async updateUser(username: string, fields: UserUpdate): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // retrive user from database
    let new_user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // validate email
    if (fields.hasOwnProperty("email")) {
      if (fields.email?.trim() !== new_user.email) {
        let emailTaken = false;
        try {
          await mongo.getDocByParam(
            users,
            "email",
            fields.email?.trim(),
            "email"
          );
          emailTaken = true;
        } catch (e) {}
        if (emailTaken) {
          throw "email taken";
        }
        new_user.email = validator.checkEmail(fields.email);
      }
    }

    // validate first name
    if (fields.hasOwnProperty("firstName")) {
      new_user.firstName = validator.checkName(fields.firstName);
    }

    // validate last name
    if (fields.hasOwnProperty("lastName")) {
      new_user.lastName = validator.checkName(fields.lastName);
    }

    // validate bio
    if (fields.hasOwnProperty("bio") && fields.bio !== undefined) {
      new_user.bio = validator.checkString(fields.bio);
    }

    // validate password and encrypt with specified salt rounds
    if (fields.hasOwnProperty("password")) {
      let password = validator.checkPassword(fields.password, "password");
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      new_user.password = hashedPassword;
    }

    // update user in database using mongo helper functions
    let result = (await mongo.replaceDocById(
      users,
      new_user._id.toString(),
      new_user,
      "user"
    )) as User;
    return result;
  },

  /**
   * Sets a user's profile picture
   * @param {string} username of the user to set the picture for
   * @param {string} picture byte data of the picture
   * @returns {Promise} Promise object that resolves to a user object
   */
  async setProfilePicture(username: string, picture: string): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // retrive user from database
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // validate picture
    picture = validator.checkImage(picture, "picture");

    // update user with supplied profile picture
    user.profilePicture = picture;
    let result = (await mongo.replaceDocById(
      users,
      user._id.toString(),
      user,
      "user"
    )) as User;
    return result;
  },

  /**
   * Toggles a user's enrollment in a specific course
   * @param {string} username of the user
   * @param {string} courseId id of the course
   * @returns {Promise} Promise object that resolves to a user object
   */
  async toggleEnrollment(username: string, courseId: string): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // retrive user from database
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // validate courseId
    courseId = mongo.checkId(courseId, "courseId");

    // confirm course with supplied id exists
    let course = (await mongo.getDocById(
      courses,
      courseId,
      "courseId"
    )) as Course;

    // toggle user's enrollment of supplied courseId
    const courseIndex = user.enrolledCourses.indexOf(courseId);
    if (courseIndex > -1) {
      // unenroll user from course
      user.enrolledCourses.splice(courseIndex, 1);

      // iterate over lessons of the course to update user's progress
      for (let lessonId of course.lessons) {
        let lesson = (await mongo.getDocById(
          lessons,
          lessonId.toString(),
          "lessonId"
        )) as Lesson;

        // remove user from viewed array
        lesson.viewed = lesson.viewed.filter(
          (tUsername) => tUsername !== username
        );

        // if lesson has a quiz, remove user from completed array
        if (lesson.quiz) {
          lesson.quiz.completed = lesson.quiz.completed.filter(
            (tUsername) => tUsername !== username
          );
        }

        // update the lesson in the database
        await mongo.replaceDocById(
          lessons,
          lesson._id.toString(),
          lesson,
          "lesson"
        );
      }
    } else {
      user.enrolledCourses.push(courseId);
    }

    // update user with toggled enrolled courses in the database
    let result = (await mongo.replaceDocById(
      users,
      user._id.toString(),
      user,
      "user"
    )) as User;
    delete result.password;
    return result;
  },

  /**
   * Deletes a user
   * @param {string} username of the user to delete
   * @returns {Promise} Promise object that resolves to a user object
   */
  async deleteUser(username: string): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // retrieve user to be deleted
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // delete user from database using mongo helper functions
    let deleted_user = (await mongo.deleteDocById(
      users,
      user._id.toString(),
      "user"
    )) as User;
    delete deleted_user.password;
    console.log(deleted_user);
    return deleted_user;
  },

  /**
   * Gets an array of applications
   * @param {string} usernameQuery string to filter the username by [username]
   * @param {string} sortBy [created, username]
   * @param {boolean} sortOrder [true: ascending, false: descending]
   * @param {string[]} statusFilter array of statuses to filter by [approved, declined, pending]
   * @returns {Promise} Promise object that resolves to an array of all applications
   */
  async getApplications(
    usernameQuery?: string,
    sortBy?: string,
    sortOrder?: boolean,
    statusFilter?: string[]
  ): Promise<any> {
    const query: any = {};
    const sortOptions: any = {};

    // validate and filter by usernameQuery if provided
    if (usernameQuery) {
      usernameQuery = validator.checkString(usernameQuery, "usernameQuery");
      query.username = { $regex: new RegExp(usernameQuery as any, "i") };
    }

    // validate and filter by application status if provided
    query["application.status"] = { $in: ["accepted", "pending", "declined"] };
    if (statusFilter && statusFilter.length > 0) {
      for (let i = 0; i < statusFilter.length; i++) {
        statusFilter[i] = validator.checkStatus(
          statusFilter[i],
          "statusFilter"
        );
      }
      query["application.status"] = { $in: statusFilter };
    }

    // set sortBy and sortOrder parameters if provided
    if (sortBy === "created") {
      sortOptions["application.created"] = sortOrder ? 1 : -1;
    } else if (sortBy === "username") {
      sortOptions.username = sortOrder ? 1 : -1;
    }

    // query and sort data from the database
    const usersCollection = await users();
    const usersWithApplications = await usersCollection
      .find(query)
      .sort(sortOptions)
      .toArray();

    return usersWithApplications;
  },

  /**
   * Creates a new application for a user
   * @param {string} username of the user to create an application for
   * @param {string} content of the application
   * @param {string[]} documents array of document links
   * @returns {Promise} Promise object that resolves to a user object
   */
  async createApplication(
    username: string,
    content: string,
    documents: string[]
  ): Promise<User> {
    // validate username
    username = validator.checkUsername(username, "username");

    // retrieve user to add application to
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // validate content
    content = validator.checkString(content, "content");

    // validate documents
    documents = validator.checkLinkStringArray(documents, "documents");

    let application = {
      status: "pending",
      created: new Date(),
      content: content,
      documents: documents,
    };

    // update user with application
    user.application = application;
    let result = (await mongo.replaceDocById(
      users,
      user._id.toString(),
      user,
      "user"
    )) as User;
    delete result.password;
    return result;
  },

  /**
   * Sets the status of a user's application
   * @param username of the user to set the application status for
   * @param status to set the application to (pending, accepted, rejected)
   * @returns {Promise} Promise object that resolves to a user object
   */
  async setApplicationStatus(username: string, status: string): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // retrieve user to change application status of
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // validate status
    status = validator.checkStatus(status, "status");

    // check if user has an application
    if (user.application === null)
      throw `${username} does not have an application`;

    // update user's application status and update the database
    user.application.status = status;
    let result = (await mongo.replaceDocById(
      users,
      user._id.toString(),
      user,
      "user"
    )) as User;
    delete result.password;
    return result;
  },

  /**
   * Deletes a user's application
   * @param username of the user to delete the application for
   * @returns {Promise} Promise object that resolves to a user object
   */
  async deleteApplication(username: string): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // retrieve user to delete application for
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // check if user has an application
    if (user.application === null)
      throw `${username} does not have an application to delete`;

    // update user's application status and update the database
    user.application = null;
    let result = (await mongo.replaceDocById(
      users,
      user._id.toString(),
      user,
      "user"
    )) as User;
    delete result.password;
    return result;
  },

  /**
   * Returns if a user has completed a specific course
   * @param {string} username of the user
   * @param {string} courseId id of the course
   * @returns {Promise} Promise object that resolves to a boolean
   */
  async hasCompletedCourse(
    username: string,
    courseId: string
  ): Promise<boolean> {
    // validate username and retrieve user from database
    username = validator.checkUsername(username, "username");
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // validate courseId and retrieve from database
    courseId = mongo.checkId(courseId.toString(), "courseId");
    let course = (await mongo.getDocById(
      courses,
      courseId.toString(),
      "courseId"
    )) as Course;

    // check if user completed course
    for (let lessonId of course.lessons) {
      let lesson = (await mongo.getDocById(
        lessons,
        lessonId.toString(),
        "lessonId"
      )) as Lesson;

      // check if user viewed the lesson
      if (!lesson.viewed.includes(user.username)) {
        return false;
      }

      // if lesson has a quiz, check if user completed it
      if (lesson.quiz && !lesson.quiz.completed.includes(user.username)) {
        return false;
      }
    }

    return true;
  },

  /**
   * gets all courses completed by a specific user
   * @param {string} username of the user
   * @returns {Promise} Promise object that resolves to an array of course objects
   */
  async getCompletedCourses(username: string): Promise<Course[]> {
    // validate username and retrieve user from database
    username = validator.checkUsername(username, "username");
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    let completedCourses: Course[] = [];

    // add completed enrolled courses to completed courses array
    for (let courseId of user.enrolledCourses) {
      const isCompleted = await this.hasCompletedCourse(
        username,
        courseId.toString()
      );
      if (isCompleted) {
        let course = (await mongo.getDocById(
          courses,
          courseId.toString(),
          "courseId"
        )) as Course;
        completedCourses.push(course);
      }
    }

    return completedCourses;
  },

  /**
   * gets a sorted array of the most popular completed course tags for a specific user
   * @param {string} username of the user
   * @returns {Promise} Promise object that resolves to an array of strings
   */
  async topCompletedTags(username: string): Promise<string[]> {
    // validate username
    username = validator.checkUsername(username, "username");

    // get all completed courses for a specific user
    const completedCourses = await this.getCompletedCourses(username);

    // aggregate and count the occurrences of each tag
    const tagCounts: { [tag: string]: number } = {};
    for (const course of completedCourses) {
      for (const tag of course.tags) {
        if (tagCounts[tag]) {
          tagCounts[tag] += 1;
        } else {
          tagCounts[tag] = 1;
        }
      }
    }

    // sort tags based on frequency
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0]);

    return sortedTags;
  },

  async setAdmin(username: string, admin: boolean): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // retrieve user to change application status of
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // update user's application status and update the database
    user.admin = admin;
    let result = (await mongo.replaceDocById(
      users,
      user._id.toString(),
      user,
      "user"
    )) as User;
    delete result.password;
    return result;
  },
};

export default methods;
