const mongo = require("mongodb");
const url =
  "mongodb+srv://user1:xj97z2OjiB4IqgFi@cluster0.almsf.mongodb.net/MinistryOfInterior?retryWrites=true&w=majority";
const MongoClient = mongo.MongoClient;
const ObjectId = require("mongodb").ObjectId;

const dbName = "MinistryOfInterior",
  collection = "data";

function Creat(req, res) {
  const obj = req.body;
  if (
    Object.keys(obj).length === 0 ||
    !(obj.firstName || false) ||
    !(obj.lastName || false) ||
    !(obj.age || false) ||
    !(obj.address || false)
  ) {
    res.status(404).send("invalid input");
  } else {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      let dbo = db.db(dbName);
      dbo.collection(collection).insertOne(obj, function (err, result) {
        if (err) throw err;
        res.send("1 document inserted");
        db.close();
      });
    });
  }
}

function Read(req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db(dbName);
    dbo
      .collection(collection)
      .find(req.body)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result.length ? result : "Nothing Was Found!");
        db.close();
      });
  });
}

function Update(req, res) {
  let good_id = check_id(req, res);
  if (good_id) {
    let { _id, ...newValues } = req.body;
    newValues = { $set: newValues };
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      let dbo = db.db(dbName);
      dbo
        .collection(collection)
        .updateOne({ _id: good_id }, newValues, function (err, result) {
          if (err) throw err;
          result.modifiedCount
            ? res.send("1 document updated")
            : res.status(404).send(`Can't find _id = ${_id}`);

          db.close();
        });
    });
  }
}

function Delete(req, res) {
  let good_id = check_id(req, res);
  if (good_id) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      let { _id } = req.body;
      dbo
        .collection(collection)
        .deleteOne({ _id: good_id }, function (err, result) {
          if (err) throw err;
          console.log(result);
          result.deletedCount
            ? res.send("1 document updated")
            : res.status(404).send(`Can't find _id = ${_id}`);
          db.close();
        });
    });
  }
}

function check_id(req, res) {
  if ("_id" in req.body) {
    let { _id, ...newValues } = req.body;
    newValues = { $set: newValues };
    let good_id;
    try {
      good_id = new ObjectId(_id);
    } catch (error) {
      res.status(404).send(`Error Input Of _id = ${_id}`);
    }
    return good_id;
  } else {
    res.status(404).send("Can't Find _id key");
  }
}

function search(req, res) {
    if("age" in req.query){
        req.query.age = +req.query.age; 
    }

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db(dbName);
    dbo
      .collection(collection)
      .find(req.query)
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result.length ? result : "Nothing Was Found!");
        db.close();
      });
  });
}

module.exports = {
  Creat,
  Read,
  Update,
  Delete,
  search,
};
