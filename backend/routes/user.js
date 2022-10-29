const express = require("express");
const { userCollection } = require("../data/Refs");
const router = express.Router();
const { v4 } = require("uuid");
const { storage } = require("../data/firebase");
const { transactionCollection } = require("../data/Refs");
//const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
//const { getDatabase } = require("firebase-admin/database");
//const { ref, child, get } = require("firebase/database");
// "isPassword" function used to check pass
function isPassword(str) {
  if (!str) throw `Password must be provided`;
  if (typeof str != "string") throw `Password must be a string`;
  if (str.trim().length == 0) throw `Password cannot just be empty spaces`;
  if (str.toLowerCase().trim() != str.toLowerCase().trim().replace(/\s+/g, ""))
    throw `Password cannot have spaces`;
  let strippedStr = str.toLowerCase().trim().replace(/\s+/g, "");
  if (strippedStr.length < 6) throw `Password must be at least six characters`;
}
// "SIGNUP" Router calling "CreateUser"
router.post("/signup", async (req, res) => {
  try {
    //const { publicId, password, firstName, lastName, email, profilePhotoUrl, type } = req.body;
    const { name, email, password, phone, children, wallet, userName } =
      req.body;
    isPassword(password);
    const userData = {
      name: name,
      id: v4(),
      phone: phone,
      email: email,
      children: children,
      wallet: wallet,
      lastActive: null,
      isActive: false,
    };
    userCollection()
      .orderByChild("id")
      .equalTo(userData.id)
      .once("value", (snapshot) => {
        try {
          let result = [];
          userCollection().off("value");
          for (var key in snapshot.val()) {
            result.push({ id: key, ...snapshot.val()[key] });
          }
          if (result.length >= 1) {
            res
              .status(404)
              .json(
                "An account with this email already exists. Please try logging in."
              );
          } else {
            userCollection(userData.id).set(userData, (error) => {
              if (error) {
                res
                  .status(500)
                  .json({ error: "User could not be registered!" });
              } else {
                res.json(userData);
              }
            });
          }
        } catch (error) {
          console.log(error);
          res
            .status(500)
            .json({ error: error.message ? error.messsage : error });
          console.log(error);
        }
      });
    // res.json('success');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message ? error.messsage : error });
  }
});
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

router.get("/logout/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ error: "Please provide a userId" });
    return;
  }
  userCollection(userId).once("value", (snapshot) => {
    try {
      if (!snapshot.val()) {
        res.json("No username found");
        return;
      } else {
        if (snapshot.val()) {
          userCollection(userId).update({ isActive: false }, (error) => {
            if (error) {
              res.status(500).json("could not logout");
            } else {
              res.json("logged out successfully!");
            }
          });
        }
      }
    } catch (error) {
      res.status(500).json({ error: error.message ? error.messsage : error });
      console.log(error);
      return;
    }
  });
});

router.post("/requestMoney", async (req, res) => {
  const { sender_id, receiver_id, amount, state, tag } = req.body;
  transactionData = {
    id: v4(),
    sender_id: sender_id,
    receiver_id: receiver_id,
    amount: amount,
    timestamp: new Date(),
    state: state,
    tag: tag,
  };
  console.log(transactionData["id"]);
  transactionCollection()
    .orderByChild("id")
    .equalTo(transactionData["id"])
    .once("value", (snapshot) => {
      transactionCollection(transactionData["id"]).set(
        transactionData,
        (error) => {
          if (error) {
            res.status(500).json({ error: " Money could not be requested!" });
          } else {
            res.json(transactionData);
          }
        }
      );
    });
});

router.post("/splitMoney", async (req, res) => {
  const { sender_id, tag } = req.body;
  let totalMoney = 0;
  let noOfChildren = 0;
  let sender_name = "";
  const hash = new Map();
  const userRef = userCollection();
  await userRef.get().then((snapshot) => {
    //console.log(snapshot.val());
    for (let key in snapshot.val()) {
      hash.set(snapshot.val()[key]["name"], snapshot.val()[key]);
      if (key === sender_id) {
        totalMoney = snapshot.val()[key]["wallet"];
        noOfChildren = snapshot.val()[key]["children"].length;
        sender_name = snapshot.val()[key]["name"];
      }
    }
  });
  parentObj = hash.get(sender_name);
  lstOfChildren = parentObj["children"];
  if (totalMoney < 1) {
    res.status(500).send("Not Enough Money!");
  }
  let each = totalMoney / noOfChildren;
  for (let child in lstOfChildren) {
    let obj = hash.get(lstOfChildren[child]);
    obj["wallet"] += each;
    userCollection(obj["id"]).update(obj, (error) => {
      if (error) {
        res.status(500).json({ error: " " });
      } else {
        //res.json(obj);
      }
    });
  }
  parentObj["wallet"] = 0;
  await userCollection()
    .orderByChild("id")
    .equalTo(parentObj["id"])
    .once("value", (snapshot) => {
      userCollection(parentObj["id"]).update(parentObj, (error) => {
        if (error) {
          res.status(500).json({ error: " " });
        } else {
          //res.json(parentObj);
        }
      });
    });
  //updating transaction table
  for (let i in lstOfChildren) {
    let child = lstOfChildren[i];
    let childObj = hash.get(child);
    let transactionData = {
      sender_id: sender_id,
      receiver_id: childObj["id"],
      amount: each,
      timestamp: new Date(),
      state: "Done",
      tag: tag,
    };
    await transactionCollection(v4()).set(transactionData, (error) => {
      if (error) {
        res.status(500).json({ error: " " });
      } else {
        //res.json(transactionData);
      }
    });
  }
  res.send("Successfull!");
});

router.post("/allocateMoney", async (req, res) => {
  const { sender_id, childrenNames, amount, timestamp, state, tag } = req.body;
  totalMoney = 0;
  noOfChildren = 0;
  let sender_name = "";
  const hash = new Map();
  try {
    const userRef = userCollection();
    await userRef.get().then((snapshot) => {
      for (let key in snapshot.val()) {
        hash.set(snapshot.val()[key]["name"], snapshot.val()[key]);
        if (key === sender_id) {
          totalMoney = snapshot.val()[key]["wallet"];
          noOfChildren = snapshot.val()[key]["children"].length;
          if (totalMoney < amount * noOfChildren) {
            res.status(500).send("Not Enough Money!");
            return;
          }
          sender_name = snapshot.val()[key]["name"];
        }
      }
    });
    parentObj = hash.get(sender_name);
    lstOfChildren = childrenNames;
    for (let child in lstOfChildren) {
      let obj = hash.get(lstOfChildren[child]);
      obj["wallet"] += amount;
      await userCollection(obj["id"]).update(obj, (error) => {
        if (error) {
          res.status(500).json({ error: " " });
        } else {
          res.json(obj);
        }
      });
    }
    parentObj["wallet"] -= lstOfChildren.length * amount;
    await userCollection()
      .orderByChild("id")
      .equalTo(parentObj["id"])
      .once("value", (snapshot) => {
        userCollection(parentObj["id"]).update(parentObj, (error) => {
          if (error) {
            res.status(500).json({ error: " " });
          } else {
            res.json(parentObj);
          }
        });
      });
    //updating transaction table
    for (let i in lstOfChildren) {
      let child = lstOfChildren[i];
      let childObj = hash.get(child);
      let transactionData = {
        sender_id: sender_id,
        receiver_id: childObj["id"],
        amount: each,
        timestamp: new Date(),
        state: "Done",
        tag: tag,
      };
      console.log(sender_id);
      await transactionCollection(v4()).set(transactionData, (error) => {
        if (error) {
          res.status(500).json({ error: " " });
        } else {
          res.json(transactionData);
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
});
router.get("/parent/pending/:id", async (req, res) => {
  const parentId = req.params.id;
  console.log(parentId);
  let result = [];
  transactionCollection().on(
    "value",
    (snapshot) => {
      for (let key in snapshot.val()) {
        console.log(snapshot.val()[key]);
        if (
          snapshot.val()[key]["receiver_id"] === parentId &&
          snapshot.val()[key]["state"] === "Pending"
        ) {
          result.push(snapshot.val()[key]);
        }
      }
      res.status(200).send(result);
    },
    (errorObject) => {
      res.status(500).send(errorObject);
    }
  );
});
module.exports = router;
