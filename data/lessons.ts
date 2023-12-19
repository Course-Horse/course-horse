import { lessons, courses, users } from "@/config/mongoCollections.js";
import { mongo, validator } from "@/data/helpers/index.ts";
import { Quiz, Lesson, Course, User, LessonUpdate } from "@/types";

const methods = {
  /**
   * Retrieve all lessons for a specific course
   * @param {string} courseId of the course to retrieve lessons from
   * @returns {Promise<string[]>} Promise object that resolves to an array of lessonId strings
   */
  async getLessons(courseId: string): Promise<string[]> {
    // validate courseId and retrieve parent course
    courseId = mongo.checkId(courseId, "courseId");
    let parent_course = (await mongo.getDocById(
      courses,
      courseId,
      "course"
    )) as Course;

    // return lessons
    return parent_course.lessons;
  },

  /**
   * Gets a lesson with a specific id
   * @param {string} lessonId of the lesson to retrieve
   * @returns {Promise<Lesson>} Promise object that resolves to a lesson object
   */
  async getLesson(lessonId: string): Promise<Lesson> {
    // validate lessonId
    lessonId = mongo.checkId(lessonId, "lessonId");

    // retrieve lesson from the database
    let result = (await mongo.getDocById(
      lessons,
      lessonId,
      "lesson"
    )) as Lesson;
    return result;
  },

  /**
   * Creates a new lesson for a course in the database
   * @param {string} courseId
   * @param {string} title
   * @param {string} description
   * @param {string} content
   * @param {string[]} videos
   * @param {Quiz} quiz
   * @returns {Promise} Promise object that resolves to a course object
   */
  async createLesson(
    courseId: string,
    title: string,
    description: string,
    content: string,
    videos: string[],
    quiz?: Quiz
  ) {
    // validate courseId
    courseId = mongo.checkId(courseId, "courseId");
    let parent_course = (await mongo.getDocById(
      courses,
      courseId,
      "course"
    )) as Course;

    // validate title
    title = validator.checkString(title, "title");

    // validate description
    description = validator.checkString(description, "description");

    // validate content
    content = validator.checkString(content, "content");

    // validate videos
    videos = validator.checkVideoStringArray(videos, "videos");

    // check for quiz
    let quiz_obj = quiz !== undefined ? quiz : null;

    // create lesson object
    let lesson = {
      courseId: courseId,
      title: title,
      description: description,
      content: content,
      videos: videos,
      created: new Date(),
      viewed: [],
      quiz: quiz_obj,
      discussion: [],
    };

    // add lesson object to database using mongo helper functions
    let result = (await mongo.createDoc(lessons, lesson, "lesson")) as Lesson;

    // update parent course's lessons array
    parent_course.lessons.push(result._id);
    await mongo.replaceDocById(courses, courseId, parent_course, "course");

    return result;
  },

  /**
   * Deletes a lesson with a specific id
   * @param {string} lessonId of the lesson to delete
   * @returns {Promise<Lesson>} Promise object that resolves into a lesson object
   */
  async deleteLesson(lessonId: string): Promise<Lesson> {
    // validate lessonId and retrieve lesson
    lessonId = mongo.checkId(lessonId, "lessonId");
    let lesson = (await mongo.getDocById(
      lessons,
      lessonId,
      "lesson"
    )) as Lesson;

    // retrieve parent course
    let parent_course = (await mongo.getDocById(
      courses,
      lesson.courseId.toString(),
      "course"
    )) as Course;

    // remove lessonId from course's lessons array and update in the database
    parent_course.lessons = parent_course.lessons.filter(
      (id) => id.toString() !== lessonId
    );

    await mongo.replaceDocById(
      courses,
      parent_course._id.toString(),
      parent_course,
      "course"
    );

    // delete lesson from the database
    let result = (await mongo.deleteDocById(
      lessons,
      lessonId,
      "lessonId"
    )) as Lesson;
    return result;
  },

  /**
   * Toggles a user's username in a lesson's viewed array
   * @param {string} username of the user
   * @param {string} lessonId id of the lesson
   * @returns {Promise} Promise object that resolves to a lesson object
   */
  async toggleViewedUsername(username: string, lessonId: string): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // confirm user exists in the database
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // validate lessonId
    lessonId = mongo.checkId(lessonId, "lessonId");

    // retrieve lesson with supplied lessonId
    let lesson = (await mongo.getDocById(
      lessons,
      lessonId,
      "lessonId"
    )) as Lesson;

    // confirm user is enrolled in the course
    if (!user.enrolledCourses.includes(lesson.courseId)) {
      throw "user not enrolled in course";
    }

    // toggles a user's username in a lesson's viewed array
    const userIndex = lesson.viewed.indexOf(username);
    if (userIndex > -1) {
      lesson.viewed.splice(userIndex, 1);
    } else {
      lesson.viewed.push(username);
    }

    // update lesson with toggled viewed array
    let result = (await mongo.replaceDocById(
      lessons,
      lesson._id.toString(),
      lesson,
      "lesson"
    )) as Lesson;
    return result;
  },

  /**
   * Toggles a user's username in a lesson's quiz completed usernames array
   * @param {string} username of the user
   * @param {string} lessonId id of the lesson
   * @returns {Promise} Promise object that resolves to a lesson object
   */
  async toggleQuizCompletedUsers(
    username: string,
    lessonId: string
  ): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // confirm user exists in the database
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // validate lessonId
    lessonId = mongo.checkId(lessonId, "lessonId");

    // retrieve lesson with supplied lessonId
    let lesson = (await mongo.getDocById(
      lessons,
      lessonId,
      "lessonId"
    )) as Lesson;

    // confirm user is enrolled in the course
    if (!user.enrolledCourses.includes(lesson.courseId)) {
      throw "user not enrolled in course";
    }

    // toggles a user's username in a lesson's viewed array
    const userIndex = lesson.quiz.completed.indexOf(username);
    if (userIndex > -1) {
      lesson.quiz.completed.splice(userIndex, 1);
    } else {
      lesson.quiz.completed.push(username);
    }

    // update lesson with toggled quiz completed array
    let result = (await mongo.replaceDocById(
      lessons,
      lesson._id.toString(),
      lesson,
      "lesson"
    )) as Lesson;
    return result;
  },

  /**
   * Updates a lesson
   * @param {string} lessonId of the lesson to update
   * @param {object} fields Object whos fields correspond to the fields to update
   * @returns {Promise} Promise object that resolves to a lesson object
   */
  async updateLesson(lessonId: string, fields: LessonUpdate): Promise<Lesson> {
    // validate lessonId
    lessonId = mongo.checkId(lessonId, "lessonId");

    // retrieve lesson with specified id from the database
    let new_lesson = (await mongo.getDocById(
      lessons,
      lessonId,
      "lessonId"
    )) as Lesson;

    // validate title
    if (fields.hasOwnProperty("title")) {
      new_lesson.title = validator.checkString(fields.title, "title");
    }

    // validate description
    if (fields.hasOwnProperty("description")) {
      new_lesson.description = validator.checkString(
        fields.description,
        "description"
      );
    }

    // validate content
    if (fields.hasOwnProperty("content")) {
      new_lesson.content = validator.checkString(fields.content, "content");
    }

    // validate videos
    if (fields.hasOwnProperty("videos")) {
      new_lesson.videos = validator.checkVideoStringArray(fields.videos, "videos");
    }

    // validate quiz
    if (fields.hasOwnProperty("quiz")) {
      new_lesson.quiz = validator.checkQuiz(fields.quiz, "quiz");
    }

    // update lesson in the database using mongo helper functions
    let result = (await mongo.replaceDocById(
      lessons,
      new_lesson._id.toString(),
      new_lesson,
      "lesson"
    )) as Lesson;
    return result;
  },
};

export default methods;
