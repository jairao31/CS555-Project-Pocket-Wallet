import React, { Fragment, useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Link, useLocation, useHistory } from "react-router-dom";
import { getVasooliByFilter, splitMoney } from "./../firebase/vasooli";
// import fire from "./../firebase/fire";
import Vasoolicard from "./../components/allocateMoney/vasoolicard";
import Empty from "./../components/general/empty.component";
import Form from "react-bootstrap/Form";
import fire from "../firebase/fire";
import { getUserData } from "../firebase/user";
export default function SplitMoneyV() {
  // const [filter, setfilter] = useState("ALL");
  const [SendToCardFilter, setSendToCardFilter] = useState("ALL");
  const [VasooliArr, setVasooliArr] = useState([]);
  const [loading, setloading] = useState(true);
  // const [user, setuser] = useState({});
  const [userObj, setUserObj] = useState({});
  const [isParent, setIsParent] = useState(false);
  const [amount, setAmount] = useState(0);
  const [optionType, setOptionType] = useState("");

  let loc = useLocation();

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

  //   console.log("allo------", isParent, userObj);
  //   console.log("amount_________", amount);
  //   console.log("type____________", optionType);

  const history = useHistory();

  return (
    <Fragment>
      <h3>Split Money</h3>
      {isParent === true ? (
        <div className="col-6 col-sm-6 col-md-6">
          <input
            type="number"
            className="form-control"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          ></input>
          <Form.Select
            className="custom-select w-100"
            value={optionType}
            onChange={(e) => setOptionType(e.target.value)}
            aria-label="Default select example"
          >
            <option value="" disabled selected>
              Select an Option
            </option>
            <option value="Food">Food</option>
            <option value="Fees">Fees</option>
            <option value="Commute">Commute</option>
            <option value="Stationary">Stationary</option>
            <option value="Medicine">Medicine</option>
            <option value="Bill">Bill</option>
            <option value="Other">Other</option>
          </Form.Select>
          <button
            className="btn btn-outline-info mx-1"
            onClick={() => {
              splitMoney(
                amount,
                (s) => {
                  // console.log("amount split successfully");
                  alert(
                    "Amount has been split successfully to all your childrens"
                  );
                  history.push("/");
                },
                (e) => {
                  console.log("req failed");
                }
              );
            }}
          >
            submit
          </button>
        </div>
      ) : (
        <div>
          <p>You do not have access to this page</p>
        </div>
      )}
    </Fragment>
  );
}
