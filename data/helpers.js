import validator from "@/data/validator.js";
import { ObjectId } from "mongodb";

/**
 * Gets all docs as an array from a collection
 * @param {function} collectionGetter - function that returns the collection. refer to @/config/mongoCollections.ts
 * @returns {Array<object>} of docs
 */
async function getAllDocs(collectionGetter) {
  let collection = await collectionGetter();
  let allDocs = await collection.find({}).toArray();

  for (let i = 0; i < allDocs.length; i++) {
    allDocs[i]["_id"] = allDocs[i]["_id"].toString();
  }
  return allDocs;
}

/**
 * Gets one document from a collection by its _id
 * @param {function} collectionGetter - function that returns the collection
 * @param {string} id - id of the doc to get
 * @param {string} docType - name of docType (e.g. "user")
 * @returns {object} of the doc
 */
async function getDocById(collectionGetter, id, docType) {
  id = validator.checkId(id, "id");

  let collection = await collectionGetter();
  let doc = await collection.findOne({ _id: new ObjectId(id) });
  if (doc === null) throw `no ${docType} with that id`;
  return doc;
}

/**
 * Gets one document from a collection by a given attribute
 * e.g. get a user by username
 * @param {function} collectionGetter - function that returns the collection
 * @param {string} param - attribute to search by
 * @param {any} paramValue - value of the attribute
 * @param {string} docType - name of docType (e.g. "user")
 * @returns {object} of the doc
 */
async function getDocByParam(collectionGetter, param, paramValue, docType) {
  let collection = await collectionGetter();
  let filter = {};
  filter[param] = paramValue;
  let doc = await collection.findOne(filter);
  if (doc === null) throw `no ${docType} with ${param} of ${paramValue}`;
  return doc;
}

/**
 * Gets all documents from a collection by a given attribute
 * e.g. gets all users with a given role
 * @param {function} collectionGetter - function that returns the collection
 * @param {string} param - attribute to search by
 * @param {any} paramValue - value of the attribute
 * @param {string} docType - name of docType (e.g. "user")
 * @returns {Array<object>} of docs
 */
async function getAllDocsByParam(collectionGetter, param, paramValue, docType) {
  let collection = await collectionGetter();
  let filter = {};
  filter[param] = paramValue;
  let allDocs = await collection.find(filter).toArray();
  if (allDocs.length === 0)
    throw `no ${docType} with ${param} of ${paramValue}`;
  return allDocs;
}

/**
 * Gets all documents from a collection by a given attribute, skiping a given number of documents and limiting the number of documents returned
 * e.g. gets all users with a given role, skipping the first 10 and limiting to 10
 * @param {function} collectionGetter - function that returns the collection
 * @param {string} param - attribute to search by
 * @param {any} paramValue - value of the attribute
 * @param {string} docType - name of docType (e.g. "user")
 * @param {int} skip - number of documents to skip
 * @param {int} limit - number of documents to limit
 * @returns {Array<object>} of docs
 */
async function getAllDocsByParamSkipLimit(
  collectionGetter,
  param,
  paramValue,
  docType,
  skip,
  limit
) {
  let collection = await collectionGetter();
  let filter = {};
  filter[param] = paramValue;
  let allDocs = await collection.find(filter).skip(skip).limit(limit).toArray();
  if (allDocs.length === 0)
    throw `no ${docType} with ${param} of ${paramValue}`;
  return allDocs;
}

/**
 * Creates a doc in a collection
 * @param {function} collectionGetter - function that returns the collection
 * @param {object} doc - doc to create
 * @param {string} docType - name of docType (e.g. "user")
 * @returns {object} of created doc
 */
async function createDoc(collectionGetter, doc, docType) {
  let collection = await collectionGetter();
  let insertInfo = await collection.insertOne(doc);
  if (!insertInfo["acknowledged"] || !insertInfo["insertedId"])
    throw `could not add ${docType}r`;

  let newId = insertInfo[["insertedId"]].toString();
  doc = await getDocById(collectionGetter, newId, docType);
  return doc;
}

/**
 * deletes doc from a collection by its id
 * @param {function} collectionGetter - function that returns the collection
 * @param {string} id - id of the doc to delete
 * @param {string} docType - name of docType (e.g. "user")
 * @returns object of deleted doc
 */
async function deleteDocById(collectionGetter, id, docType) {
  id = validator.checkId(id, "id");

  let collection = await collectionGetter();
  let deletionInfo = await collection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (deletionInfo.lastErrorObject.n === 0) {
    throw `could not delete ${docType} with id of ${id}`;
  }
  return deletionInfo.value;
}

/**
 * Replace a doc in a collection by its id
 * @param {function} collectionGetter - function that returns the collection
 * @param {string} id - _id of the doc to replace
 * @param {object} replacement - replacement doc
 * @param {string} docType - name of docType (e.g. "user")
 * @returns {object} of the replaced doc
 */
async function replaceDocById(collectionGetter, id, replacement, docType) {
  id = validator.checkId(id, "id");

  let collection = await collectionGetter();
  let updatedInfo = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: replacement },
    { returnDocument: "after" }
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw `could not update ${docType} successfully`;
  }
  return updatedInfo.value;
}

export {
  getAllDocs,
  getDocById,
  getDocByParam,
  getAllDocsByParam,
  createDoc,
  deleteDocById,
  replaceDocById,
  getAllDocsByParamSkipLimit,
};
