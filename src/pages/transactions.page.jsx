import React, { useState, useEffect, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import Transactioncard from "./../components/transactions/transactioncard";
import { getTransactionByFilter } from "./../firebase/transaction";
import Spinner from "react-bootstrap/Spinner";
import Empty from "./../components/general/empty.component";
import { Button, Table } from "react-bootstrap";
import {
  getUserData,
  getCurrentUser,
  getAllTransactions,
  getUserDataForName,
  getAllTransactionsForChild,
} from "./../firebase/user";
import fire from "./../firebase/fire";
const labels = {
  ALL: "All",
  INC: "Incomes",
  EXP: "Expenses",
};

export default function TransactionsV() {
  const [filter, setfilter] = useState("ALL");
  const [TransactionsArr, setTransactionsArr] = useState([]);
  const [loading, setloading] = useState(true);
  const [userObj, setUserObj] = useState({});
  const [isParent, setIsParent] = useState(false);
  let loc = useLocation();
  const [allTrans, setAllTrans] = useState([]);
  const [allTransChild, setAllTransChild] = useState([]);
  const graphData = [];
  const graphDataChild = [];

  const getDataFromFB = () => {
    setloading(true);
    let user = fire.auth().currentUser;
    getUserData(
      user?.uid,
      (s) => {
        let userD = s;
        setUserObj(userD);
        if (userD.isParent === true) {
          setIsParent(true);
        } else {
          setIsParent(false);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(() => {
    getDataFromFB();
  }, []);

  useEffect(() => {
    async function getmyTransactions() {
      let user = fire.auth().currentUser;
      let pd = await getAllTransactions(user.uid);

      await Promise.all(
        pd.map(async (element) => {
          await getUserDataForName(element.sender_id).then((reso) => {
            if (reso != null) {
              const dateFormat = new Date(1970, 0, 1);
              dateFormat.setSeconds(element.timestamp.seconds);
              const myDate =
                dateFormat.getMonth() +
                1 +
                "/" +
                dateFormat.getDate() +
                "/" +
                dateFormat.getFullYear();
              graphData.push({
                Date: myDate,
                category: element.category,
                Amount: element.amount,
                Child: reso.name,
                State: element.state,
              });
            }
          });
        })
      );
      setAllTrans(graphData);
    }
    getmyTransactions();
  }, []);

  useEffect(() => {
    async function getmyTransactionsChild() {
      let user = fire.auth().currentUser;
      let pd = await getAllTransactionsForChild(user.uid);

      pd.map((element) => {
        const dateFormat = new Date(1970, 0, 1);
        dateFormat.setSeconds(element.timestamp.seconds);
        const myDate =
          dateFormat.getMonth() +
          1 +
          "/" +
          dateFormat.getDate() +
          "/" +
          dateFormat.getFullYear();
        graphDataChild.push({
          Date: myDate,
          category: element.category,
          Amount: element.amount,
          State: element.state,
        });
      });
      setAllTransChild(graphDataChild);
    }
    getmyTransactionsChild();
  }, []);

  console.log("parentArr------------", allTrans);
  console.log("childArr-------------", allTransChild);

  return (
    <Fragment>
      <h1>All Transactions</h1>
      {isParent === true ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Child</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>State</th>
            </tr>
          </thead>
          {allTrans && allTrans.length > 0 ? (
            <tbody>
              {allTrans.map((reqq, idx) => (
                <tr key={idx}>
                  <td>{reqq.Child}</td>
                  <td>{reqq.Amount}</td>
                  <td>{reqq.category}</td>
                  <td>{reqq.Date}</td>
                  <td>{reqq.State}</td>
                  {/* <td>{reqq.buttonState === false ? reqq.amount : "-"}</td>
                      <td>
                        {reqq.buttonState === false ? reqq.state : "Done ✅"}
                      </td> */}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody></tbody>
          )}
        </Table>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>State</th>
            </tr>
          </thead>
          {allTransChild && allTransChild.length > 0 ? (
            <tbody>
              {allTransChild.map((reqq, idx) => (
                <tr key={idx}>
                  <td>{reqq.Amount}</td>
                  <td>{reqq.category}</td>
                  <td>{reqq.Date}</td>
                  <td>{reqq.State}</td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody></tbody>
          )}
        </Table>
      )}
    </Fragment>
  );
}
