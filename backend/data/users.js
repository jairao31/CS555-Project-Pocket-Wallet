const { ObjectId } = require("bson");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

module.exports = {
  async get(id) {
    //id taken as a string
    if (!id) throw "You must provide an id to search for";
    //console.log(id);
    if (typeof id !== "string" || id.length === 0) {
      throw "Invalid Id value";
    }
    if (!ObjectId.isValid(id)) {
      throw "ObjectId is not Valid";
    }
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (user === null) throw `No User with id: ${id}`;
    user["_id"] = user["_id"].toString();
    return user;
  },

  async getAll() {
    const userCollection = await users();
    const AllUsers = await userCollection.find({}).toArray();
    AllUsers.forEach(function (x) {
      x["_id"] = x["_id"].toString();
    });
    return AllUsers;
  },

  async create(name, location, phoneNumber) {
    if (!name || !location || !phoneNumber) throw "You must provide all inputs";

    if (
      typeof name !== "string" ||
      name.length === 0 ||
      typeof location !== "string" ||
      location.length === 0 ||
      typeof phoneNumber !== "string" ||
      phoneNumber.length === 0
    ) {
      throw "Name/ location/ phoneNumber are either non string or empty string values";
    }
    var phoneno = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneno.test(phoneNumber)) {
      throw "Invalid Phone number format";
    }

    const userCollection = await users();
    let newUser = {
      name,
      location,
      phoneNumber,
    };
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw "Could not add user";
    const newId = insertInfo.insertedId;
    return newId.toString();
  },

  async remove(id) {
    if (!id) throw "You must provide an id to search for";
    //console.log(id);
    if (typeof id !== "string" || id.length === 0) {
      throw "Invalid Id value";
    }
    if (!ObjectId.isValid(id)) {
      throw "ObjectId is not Valid";
    }
    const userCollection = await users();

    const deletionInfo = await userCollection.deleteOne({ _id: ObjectId(id) });

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete user with id of ${id}/ User not exist with this ID`;
    }
    return { deleted: true };
  },

  async rename(id, phoneNumber) {
    if (!id) throw "You must provide an id to search for";
    if (typeof id !== "string" || id.length === 0) {
      throw "Invalid Id value";
    }
    if (!ObjectId.isValid(id)) {
      throw "ObjectId is not Valid";
    }
    const Prev_ph = await this.get(id);
    if (Prev_ph["phoneNumber"] === phoneNumber) {
      throw "Same(prev and current) phoneNumber cant be updated";
    }
    if (!phoneNumber) throw "You must provide phoneNumber name for update";

    // if(typeof(phoneNumber)!=='string' || phoneNumber.length===0){
    //   throw 'Invalid Id value';
    // }
    var phoneno = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneno.test(phoneNumber)) {
      throw "Invalid Phone number format";
    }

    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: { phoneNumber: phoneNumber } }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw `could not update user name successfully. User with Id: ${id} doesn't exists`;
    } else {
      console.log("Updated Successfully");
    }
    // const users = await this.get(id);
    // return users;
  },
};
