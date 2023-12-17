/*
COURSES COLLECTION SCHEMA
{
    _id: ObjectId,
    owner: ObjectId,
    name: String,
    coursePicture: String,
    description: String,
    tags: [String],
    created: integer,
    lessons: [ObjectId],
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
