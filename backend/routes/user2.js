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

//Add new transaction
export const addTrans = (
  uid,
  { type, amount, category, date, desc },
  successFn,
  errorFn
) => {
  let obj = {
    user: uid,
    type,
    amount,
    category,
    date,
    desc,
  };
  const db = fire.firestore();
  db.collection("transactions")
    .add(obj)
    .then((res) => successFn(res))
    .catch((err) => errorFn(err));
};

//Get the Cards by Filter - "INC","EXP"
export const getTransactionByFilter = (uid, filter, successFn, errorFn) => {
  const db = fire.firestore();
  //Setting if else as per filter
  if (filter === "INC") {
    //Defailt "ALL" Case
    db.collection("transactions")
      .where("user", "==", uid)

      .where("type", "==", "INC")
      .get()
      .then((res) => successFn(res))
      .catch((err) => errorFn(err));
  } else if (filter === "EXP") {
    //Defailt "ALL" Case
    db.collection("transactions")
      .where("user", "==", uid)

      .where("type", "==", "EXP")
      .get()
      .then((res) => successFn(res))
      .catch((err) => errorFn(err));
  } else {
    //Defailt "ALL" Case
    db.collection("transactions")
      .where("user", "==", uid)

      .get()
      .then((res) => successFn(res))
      .catch((err) => errorFn(err));
  }
};

export const parentResponseToChildRequest = async (transactionId, toBeState, amount, successFn, errorFn) => {

  const db = fire.firestore();

  try{
    if(toBeState == 'Accept'){
  
      await db.collection("transactions").doc(transactionId).get().then(async (reso)=>{
        if (reso.exists) {
          //console.log("Document data:", reso.data().receiver_id);
          let currWallet = 0;
          let userId = reso.data().receiver_id;
          await db.collection("users").doc(userId).get().then(async (resp) =>{
            //console.log("Document data:", resp.data().wallet);
            currWallet = resp.data().wallet;
            if(currWallet >= amount){
              console.log("Document data:", currWallet);
              currWallet -= amount;
              await db.collection("users").doc(userId).update({
                wallet : currWallet
              })
              .catch((err) => errorFn(err));
            }else{
              throw "Not enough money!";
            }
          })
          
      }
      });
  
      db.collection("transactions")
        .doc(transactionId)
        .update({
          state: "Done",
        })
        .catch((err) => errorFn(err));
      successFn("Done!");
    }else{
      db.collection("transactions")
        .doc(transactionId)
        .update({
          state: "Denied",
        })
        .catch((err) => errorFn(err));
      successFn("Done!");
    }  
  }catch(e){
    throw "Something went wrong!";
  }
  
};

//func to create a child for logged parent
//func need some changes, after child is created, the child gets logged in.
export const createChild = (
  { email, password, fullName, parentId },
  successFn,
  errorFn
) => {
  //Random Number Gen Logic between 1 to 9 for DP
  const db = fire.firestore();
  //Firebase Authentication Signup
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      db.collection("users")
        .doc(parentId)
        .update({
          children: firebase1.firestore.FieldValue.arrayUnion(
            firebase.auth().currentUser.uid
          ),
        })
        .then(() => {
          //add child to the collection.
          const childData = {
            name: fullName,
            email: email,
            children: [],
            wallet: 0,
          };

          db.collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({ id: firebase.auth().currentUser.uid, ...childData })
            .then(() => {
              console.log("Pushed to Firestore");
            })
            .catch((er) => console.log(er));
        })
        .catch((er) => console.log(er));
    })
    .catch(function (error) {
      console.log(error);
      errorFn(error);
    });
};
module.exports = router;