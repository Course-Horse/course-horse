/*
USER COLLECTION SCHEMA
{
    _id: ObjectId,
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    created: integer,
    type: String (admin, educator, learner),
}
*/
import { users } from "@/config/mongoCollections.js";
import * as helpers from "@/data/helpers.js";

const userTypes = ["admin", "educator", "learner"];

const methods = {
  async getUsers() {
    let result = await helpers.getAllDocs(users);
    return result;
  },

  async getUser(username: string) {
    // TODO: validate username
    let user = await helpers.getDocByParam(users, "username", username, "user");
    delete user.password;
    return user;
  },

  async authUser(username: string, password: string) {
    // TODO: validate username
    // TODO: validate password

    let user = await helpers.getDocByParam(users, "username", username, "user");
    // TODO: change to encrypting and checking hashes
    if (password !== user.password)
      throw `Error authenticating user ${username}`;

    delete user.password;
    return user;
  },

  async createUser(
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    type: string
  ) {
    // TODO: validate username
    // TODO: validate password
    // TODO: validate email
    // TODO: validate firstName
    // TODO: validate lastName
    // TODO: validate type

    let user = {
      username: username,
      password: password,
      email: email,
      firstName: firstName,
      lastName: lastName,
      type: type,
    };

    let result = helpers.createDoc(users, user, "user");
    delete result.password;
    return result;
  },

  async updateUser(username: string, fields: object) {
    return "IMPLEMENT ME";
  },

  async deleteUser(username: string) {
    return "IMPLEMENT ME";
  },
};

export default methods;
