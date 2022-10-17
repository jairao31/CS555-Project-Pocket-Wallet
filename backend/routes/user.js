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

router.post("/invite/email", async (req, res) => {
  try {
    const { reciever, sender } = req.body;
    if (!reciever || !sender) {
      res.status(400).json({ error: "Insufficent inputs" });
      return;
    }

    const output = `<div>
      <p><strong>${sender.displayName}</strong> invites you to join <strong>CS 555</strong>.</p>
      <a href='http://34.238.51.139:3000/'>Click here</a>
    </div>`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.AUTH_USERNAME,
        pass: process.env.AUTH_PASSWORD,
        clientId: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_SECRET,
        refreshToken: process.env.AUTH_REFRESH_TOKEN,
      },
    });

    let info = await transporter.sendMail({
      from: `akulka12@stevens.edu`, // sender address
      to: reciever, // list of receivers
      subject: "Invite to CS 555", // Subject line
      text: `Hello, you've been invited to join CS 555 by ${sender.displayName}`, // plain text body
      html: output, // html body
    });

    res.json({ messageId: info.messageId });
    // userCollection(reciever).once('value', snapshot => {
    //   if(!snapshot.val()) {
    //     res.status(500).json({error: "Could not get reciever info"});
    //     return;
    //   }

    // })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not send email to the user" });
  }
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

router.post("/allocateMoney", async (req, res) => {
  const { sender_id, receiver_ids, amount, timestamp, state, tag } = req.body;
  totalMoney = 0;
  noOfChildren = 0;
  let sender_name = "";

  const hash = new Map();
  console.log(sender_id + "----");

  userCollection().on(
    "value",
    (snapshot) => {
      for (let key in snapshot.val()) {
        hash.set(snapshot.val()[key]["name"], snapshot.val()[key]);

        if (key === sender_id) {
            totalMoney = snapshot.val()[key]["wallet"];
            noOfChildren = snapshot.val()[key]["children"].length;
            sender_name = snapshot.val()[key]["name"];
        }
      }
    },
    (errorObject) => {
      res.status(500).send(errorObject);
    }
  );

  parentObj = hash.get(sender_name);
  lstOfChildren = parentObj["children"];
  let each = totalMoney / noOfChildren;
  for (let child in lstOfChildren) {
    let obj = hash.get(lstOfChildren[child]);
    obj["wallet"] += each;
    userCollection(obj["id"]).update(obj, (error) => {
      if (error) {
        res.status(500).json({ error: " " });
      } else {
        res.json(obj);
      }
    });
  }
  parentObj["wallet"] = 0;
  userCollection()
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
    transactionCollection(v4()).set(transactionData, (error) => {
      if (error) {
        res.status(500).json({ error: " " });
      } else {
        res.json(transactionData);
      }
    });
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
