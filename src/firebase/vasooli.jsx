import { Last } from "react-bootstrap/esm/PageItem";
import fire from "./fire";
const { v4 } = require("uuid");
var rateLimit = require("function-rate-limit");

//Add new transaction
export const Newtransaction = rateLimit(
  2,
  1000,
  (email, { to, amount, category, date, desc, status }, successFn, errorFn) => {
    let obj = {
      from: email,
      to,
      amount,
      category,
      date,
      desc,
      status,
    };
    const db = fire.firestore();
    db.collection("allocate")
      .add(obj)
      .then((res) => successFn(res))
      .catch((err) => errorFn(err));
  }
);

export const requestMoney = rateLimit(
  2,
  1000,
  ({ receiver_id, amount, category }, successFn, errorFn) => {
    let user = fire.auth().currentUser;
    let transactionData = {
      sender_id: user.uid,
      receiver_id: receiver_id,
      amount: amount,
      timestamp: new Date(),
      state: "Pending",
      category: category,
    };
    const db = fire.firestore();
    db.collection("transactions")
      .add(transactionData)
      .then((res) => successFn(res))
      .catch((err) => errorFn(err));
  }
);

export const allocateMoney = rateLimit(2, 1000, async (amount, successFn) => {
  const db = fire.firestore();
  let userId = fire.auth().currentUser.uid;
  let len = 0;
  await db
    .collection("users")
    .doc(userId)
    .get()
    .then(async (reso) => {
      if (reso.exists) {
        let childIds = reso.data().children;
        len = childIds.length;
        for (let i = 0; i < childIds.length; i++) {
          let child = childIds[i];
          await db
            .collection("users")
            .doc(child)
            .get()
            .then(async (resp) => {
              let currWallet = parseInt(resp.data().wallet);
              currWallet += parseInt(amount);

              await db.collection("users").doc(child).update({
                wallet: currWallet,
              });
              //.catch((err) => errorFn(err));
            });
        }
      }
    });

  await db
    .collection("users")
    .doc(userId)
    .get()
    .then(async (resp) => {
      let parentWallet = parseInt(resp.data().wallet);
      let toSubtract = amount * len;
      let total = 0;
      if (parentWallet >= toSubtract) {
        total = parentWallet - toSubtract;
      }

      await db.collection("users").doc(userId).update({
        wallet: total,
      });
    });
  successFn("Done!");
});
//allocateMoney([1,2], 30, "asd");

export const splitMoney = rateLimit(2, 1000, async (amount, successFn) => {
  const db = fire.firestore();
  let userId = fire.auth().currentUser.uid;
  let len = 0;
  await db
    .collection("users")
    .doc(userId)
    .get()
    .then(async (reso) => {
      if (reso.exists) {
        let childIds = reso.data().children;
        len = childIds.length;
        for (let i = 0; i < childIds.length; i++) {
          let child = childIds[i];
          await db
            .collection("users")
            .doc(child)
            .get()
            .then(async (resp) => {
              let currWallet = parseInt(resp.data().wallet);
              currWallet += parseInt(amount) / len;

              await db.collection("users").doc(child).update({
                wallet: currWallet,
              });
            });
        }
      }
    });

  await db
    .collection("users")
    .doc(userId)
    .get()
    .then(async (resp) => {
      let parentWallet = parseInt(resp.data().wallet);
      let toSubtract = amount;
      let total = 0;
      if (parentWallet >= toSubtract) {
        total = parentWallet - toSubtract;
      }

      await db.collection("users").doc(userId).update({
        wallet: total,
      });
    });
  successFn("Done!");
});

//Get Vasooli's by Filter
export const getVasooliByFilter = (email, filter, successFn, errorFn) => {
  //email : Logged in USER email
  const db = fire.firestore();
  //Setting if else as per filter
  if (filter === "PAY") {
    db.collection("vasooli")
      .where("to", "==", email)
      .get()
      .then((res) => successFn(res))
      .catch((err) => errorFn(err));
  } else if (filter === "ASK") {
    db.collection("vasooli")
      .where("from", "==", email)
      .get()
      .then((res) => successFn(res))
      .catch((err) => errorFn(err));
  } else {
    let Arr = [];
    db.collection("vasooli")
      .where("from", "==", email)
      .get()
      .then((res1) => {
        res1.forEach((item) => {
          if (item.exists) Arr.push(item.data());
        });
        db.collection("vasooli")
          .where("to", "==", email)
          .get()
          .then((res2) => {
            res2.forEach((item) => {
              if (item.exists) Arr.push(item.data());
            });
            //console.log(Arr);
            successFn(Arr);
          })
          .catch((err) => errorFn(err));
      })
      .catch((err) => errorFn(err));
  }
};

//Add new transaction
export const updateVasooliStatus = (id, { status }, successFn, errorFn) => {
  let obj = {
    status,
  };
  const db = fire.firestore();
  //  console.log(id);
  db.collection("vasooli")
    .doc(id)
    .set(obj, {
      merge: true,
    })
    .then((res) => successFn(res))
    .catch((err) => errorFn(err));
};
