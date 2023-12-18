import { users } from "@/config/mongoCollections.js";
import { mongo, validator } from "@/data/helpers/index.ts";
import { User } from "@/types";
import bcrypt from "bcrypt";

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
    // TODO: validate username
    let user = await mongo.getDocByParam(users, "username", username, "user");
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
    // TODO: validate username
    // TODO: validate password

    let user = await mongo.getDocByParam(users, "username", username, "user");
    // TODO: change to encrypting and checking hashes
    if (password !== user.password)
      throw `Error authenticating user ${username}`;

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
    validator.checkUsername(username, "username");
    let usernameTaken = false;
    try {
      await mongo.getAllDocsByParam(users, "username", username, "user");
      usernameTaken = true;
    } catch (e) {}
    if (usernameTaken) {
      throw "username taken";
    }

    // validate password
    validator.checkPassword(password, "password");

    // validate email
    validator.checkEmail(email, "email");

    // validate first name
    validator.checkName(firstName, "first name");

    // validate last name
    validator.checkName(lastName, "last name");

    // encrypt password with specified salt rounds
    const saltRounds = 16;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create user object
    let user = {
      username: username,
      password: hashedPassword,
      email: email,
      firstName: firstName,
      lastName: lastName,
      profilePicture: "",
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
  async updateUser(username: string, fields: object): Promise<any> {
    const UPDATEABLE = ["password", "email", "firstName", "lastName"];

    return "IMPLEMENT ME";
  },

  /**
   * Sets a user's profile picture
   * @param {string} username of the user to set the picture for
   * @param {string} picture byte data of the picture
   * @returns {Promise} Promise object that resolves to a user object
   */
  async setProfilePicture(username: string, picture: string): Promise<any> {
    return "IMPLEMENT ME";
  },

  /**
   * Deletes a user
   * @param {string} username of the user to delete
   * @returns {Promise} Promise object that resolves to a user object
   */
  async deleteUser(username: string): Promise<any> {
    return "IMPLEMENT ME";
  },

  /**
   * Gets an array of applications
   * @param {string} usernameQuery string to filter the username by
   * @param {string} sortBy field to sort by, one of: created, username
   * @param {boolean} sortOrder true for ascending, false for descending
   * @param {[string]} statusFilter array of statuses to filter by
   * @returns {Promise} Promise object that resolves to an array of all applications
   */
  async getApplications(
    usernameQuery: string,
    sortBy: string,
    sortOrder: boolean,
    statusFilter: [string]
  ): Promise<any> {
    return "IMPLEMENT ME";
  },

  /**
   * Creates a new application for a user
   * @param {string} username of the user to create an application for
   * @param {string} content of the application
   * @param {[string]} documents array of document links
   * @returns {Promise} Promise object that resolves to a user object
   */
  async createApplication(
    username: string,
    content: string,
    documents: [string]
  ): Promise<any> {
    return "IMPLEMENT ME";
  },

  /**
   * Sets the status of a user's application
   * @param username of the user to set the application status for
   * @param status to set the application to (pending, accepted, rejected)
   * @returns {Promise} Promise object that resolves to a user object
   */
  async setApplicationStatus(username: string, status: string): Promise<any> {
    return "IMPLEMENT ME";
  },
};

export default methods;
