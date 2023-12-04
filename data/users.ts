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

const methods = {
  async getUsers() {
    return "IMPLEMENT ME";
  },

  async getUser(id: string) {
    return "IMPLEMENT ME";
  },

  async createUser(
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    type: string
  ) {
    return "IMPLEMENT ME";
  },

  async updateUser(id: string, fields: object) {
    return "IMPLEMENT ME";
  },

  async deleteUser(id: string) {
    return "IMPLEMENT ME";
  },
};

export default methods;
