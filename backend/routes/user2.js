const express = require("express");
const { userCollection } = require("../data/Refs");
const router = express.Router();
const { v4 } = require("uuid");
const { storage } = require("../data/firebase");
const { transactionCollection } = require("../data/Refs");
const { async } = require("@firebase/util");

router.get("/getIdByName/:name", async (req, res) => {
    const name = req.params.name;
    
    userCollection().on(
        "value",
        (snapshot) => {
          for (let key in snapshot.val()) {
           
            if (snapshot.val()[key]["name"] === name) {
              res.send({"id":key});
            }
          }
        },
        (errorObject) => {
          res.status(500).send(errorObject);
        }
      );
});
router.get("/getUserById/:id", async (req, res) => {
  userId = req.params.id;

  userCollection(userId).once("value", (snapshot) => {
      try {
        if (!snapshot.val()) {
          res.json("No username found");
          return;
        } else {
          if (snapshot.val()) {
            res.json(snapshot.val());
          }
        }
      } catch (error) {
        res.status(500).json({ error: error.message ? error.messsage : error });
        console.log(error);
        return;
      }
    });
})
router.get("/getChildExpense/:id", async (req, res) => {
  let childId = req.params.id;
  var lstOfTransaction = [];

  const transactionRef = transactionCollection();
  transactionRef.get().then(snapshot => {
      for (let key in snapshot.val()) {
  
          if (snapshot.val()[key]["receiver_id"] === childId) {
            lstOfTransaction.push(snapshot.val()[key]);
          }
      }

      res.send(lstOfTransaction);
  })

})


module.exports = router;