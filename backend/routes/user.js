const express = require("express");
const { userCollection } = require("../data/Refs");
const router = express.Router();
const { v4 } = require("uuid");
const { storage } = require("../data/firebase");
const { transactionCollection } = require("../data/Refs");
//const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
//const { getDatabase } = require("firebase-admin/database");
//const { ref, child, get } = require("firebase/database");

// "searchByUserName" router calling "userCollection"
router.get("/searchByUserName", async (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName) {
      res.status(400).json({ error: "Please provide a userName" });
      return;
    }
    if (typeof userName !== "string") {
      res.status(400).json({ error: "Invalid username" });
      return;
    }
    userCollection()
      .orderByChild("userName")
      .equalTo(userName)
      .once("value", (snapshot) => {
        let result = [];
        for (var key in snapshot.val()) {
          result.push({ id: key, ...snapshot.val()[key] });
        }
        if (result.length === 0) {
          res.json(
            "Sorry! No user found with " + userName + " username. Try Again!"
          );
          return;
        }
        res.json(result);
      });
  } catch (error) {
    res.status(500).json({ error: error.message ? error.messsage : error });
  }
});

// "searchByFirstName" router calling "userCollection"
router.get("/searchByFirstName", async (req, res) => {
  try {
    const { firstName } = req.body;
    if (!firstName) {
      res.status(400).json({ error: "Please provide a firstName" });
      return;
    }
    if (typeof firstName !== "string") {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    userCollection()
      .orderByChild("firstName")
      .equalTo(firstName)
      .once("value", (snapshot) => {
        let result = [];
        for (var key in snapshot.val()) {
          result.push({ id: key, ...snapshot.val()[key] });
        }
        if (result.length === 0) {
          res.json(
            "Sorry! No user found with " + firstName + " first name. Try Again!"
          );
          return;
        }
        res.json(result);
      });
  } catch (error) {
    res.status(500).json({ error: error.message ? error.messsage : error });
  }
});

module.exports = router;
