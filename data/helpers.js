import validator from "@/data/validator.js";
import { ObjectId } from "mongodb";

async function getAllDocs(collectionGetter) {
  let collection = await collectionGetter();
  let allDocs = await collection.find({}).toArray();

  for (let i = 0; i < allDocs.length; i++) {
    allDocs[i]["_id"] = allDocs[i]["_id"].toString();
  }
  return allDocs;
}

async function getDocById(collectionGetter, id, docType) {
  id = validator.checkId(id, "id");

  let collection = await collectionGetter();
  let doc = await collection.findOne({ _id: new ObjectId(id) });
  if (doc === null) throw `no ${docType} with that id`;
  return doc;
}

async function getDocByParam(collectionGetter, param, paramValue, docType) {
  let collection = await collectionGetter();
  let filter = {};
  filter[param] = paramValue;
  let doc = await collection.findOne(filter);
  if (doc === null) throw `no ${docType} with ${param} of ${paramValue}`;
  return doc;
}

async function getAllDocsByParam(collectionGetter, param, paramValue, docType) {
  let collection = await collectionGetter();
  let filter = {};
  filter[param] = paramValue;
  let allDocs = await collection.find(filter).toArray();
  return allDocs;
}

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
  return allDocs;
}

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
 * @param {string} docType - name of docType
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
