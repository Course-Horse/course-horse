import dbConnection from "./mongoConnection.js";

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

const users = getCollectionFn("users");
const courses = getCollectionFn("courses");
const lessons = getCollectionFn("lessons");

/* Now, you can list your collections here: */
export { users, courses, lessons };
