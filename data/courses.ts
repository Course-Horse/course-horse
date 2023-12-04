/*
{
    _id: ObjectId,
    educator: ObjectId,
    name: String,
    description: String,
    created: integer,
    enrolled: [ObjectId],
}
*/

const methods = {
  async getCourses() {
    return "IMPLEMENT ME";
  },

  async getCourse(id: string) {
    return "IMPLEMENT ME";
  },

  async createCourse(educator: string, name: string, description: string) {
    return "IMPLEMENT ME";
  },

  async updateCourse(id: string, fields: object) {
    return "IMPLEMENT ME";
  },

  async deleteCourse(id: string) {
    return "IMPLEMENT ME";
  },
};

export default methods;
