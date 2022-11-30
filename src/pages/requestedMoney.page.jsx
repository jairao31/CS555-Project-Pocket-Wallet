import React, { Fragment, useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Link, useLocation, useHistory } from "react-router-dom";
import { getVasooliByFilter } from "./../firebase/vasooli";
// import fire from "./../firebase/fire";
import Vasoolicard from "./../components/allocateMoney/vasoolicard";
import Empty from "./../components/general/empty.component";
import Form from "react-bootstrap/Form";
import fire from "../firebase/fire";
import {
  getUserData,
  getParentByChildId,
  getTransactionsById,
  getSpecificUsers,
  parentResponseToChildRequest,
} from "../firebase/user";
import { useAlert } from "react-alert";
import { requestMoney } from "./../firebase/vasooli";
import { data } from "jquery";
import { Button, Table } from "react-bootstrap";

export default function RequestedMoneyV() {
  const [filter, setfilter] = useState("ALL");
  const [SendToCardFilter, setSendToCardFilter] = useState("ALL");
  const [VasooliArr, setVasooliArr] = useState([]);
  const [loading, setloading] = useState(true);
  // const [user, setuser] = useState({});
  const [userObj, setUserObj] = useState({});
  const [isParent, setIsParent] = useState(false);
  const [parentID, setParentID] = useState("");
  const [buttonState, setButtonState] = useState(false);
  // const [buttonStatus, setButtonStatus] = useState("");
  const [reqM, setReqM] = useState({
    receiver_id: "",
    amount: "",
    category: "",
  });
  // const [names, setName] = useState([]);
  // const [amounts, setAmounts] = useState([]);
  const [allReqArr, setAllReqArr] = useState([]);

  let loc = useLocation();
  const getDataFromFB = () => {
    setloading(true);
    let user = fire.auth().currentUser;
    getUserData(
      user?.uid,
      async (s) => {
        let userD = s;
        setUserObj(userD);
        if (userD.isParent === true) {
          setIsParent(true);
          let allReq = await getTransactionsById(user.uid);
          // console.log("all reqqqqqqq", allReq);
          let senderIds = allReq.map((i) => {
            return i.sender_id;
          });
          // console.log(senderIds);
          getSpecificUsers(
            senderIds,
            (s) => {
              let senderMap = {};
              // console.log(s);
              s.map((i) => {
                senderMap[i.id] = i.name;
              });
              // console.log("map: ", senderMap);
              allReq.forEach((i) => {
                i["childName"] = senderMap[i.sender_id];
                i["buttonState"] = false;
                i["buttonStatus"] = "";
              });
              // console.log(allReq);
              setAllReqArr(allReq);
            },
            (e) => {}
          );

          // allReq.forEach((ele, idx) => {
          //   // console.log("senderids", ele.sender_id);
          //   getUserData(
          //     ele.sender_id,
          //     (chData) => {
          //       allReq[idx]["childName"] = chData.name;
          //       // console.log("Namessssss", chData.name);
          //       // transactions.push(ele.state);
          //       // res.push(chData.name);
          //       // amt.push(ele.amount);
          //     },
          //     (err) => {
          //       console.log(err);
          //     }
          //   );
          // });

          // setName(res);
          // setAmounts(amt);
          // console.log(
          //   amt,
          //   "===============",
          //   transactions,
          //   "============",
          //   res
          // );
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
    // console.log("all reqqqqqqq", allReqArr);
  }, [allReqArr]);

  useEffect(() => {
    async function getParent() {
      let user = fire.auth().currentUser;
      let pd = await getParentByChildId(user.uid);
      // console.log("pd:--------- "+pd);
      setParentID(pd);
      setReqM((prev) => {
        return {
          ...prev,
          receiver_id: pd,
        };
      });
    }
    getParent();
  }, []);

  const handleReqM = (e) => {
    const { name, value } = e.target;
    setReqM((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // console.log("allreqqqqqqq", allReqArr);

  const history = useHistory();
  // const alert = useAlert();

  // console.log("isParent+++++++" + isParent);

  return (
    <Fragment>
      <h3>Request Money</h3>
      <div className="row" style={{ marginBottom: "7px" }}>
        {isParent === false ? (
          <div className="col-6 col-sm-6 col-md-6">
            {/* <input
              type="text"
              className="form-control"
              placeholder="Please enter receiver ID"
            ></input> */}
            <input
              type="number"
              name="amount"
              className="form-control"
              placeholder="Amount"
              onChange={handleReqM}
            ></input>
            <Form.Select
              className="custom-select w-100"
              // value={filter}
              // onChange={(e) => setfilter(e.target.value)}
              name="category"
              onChange={handleReqM}
              aria-label="Default select example"
            >
              <option value="">Select an Option</option>
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
              // onClick={getDataFromFB}
              onClick={() => {
                requestMoney(
                  reqM,
                  (s) => {
                    // console.log("req success");
                    alert("Money Requested Suceessfully");

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
          <>
            {/* <h1>you are a parent</h1> */}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Child Name</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              {allReqArr && allReqArr.length > 0 ? (
                <tbody>
                  {allReqArr.map((reqq, idx) => (
                    <tr key={idx}>
                      <td>{reqq.childName}</td>
                      <td>{reqq.category}</td>
                      <td>{reqq.buttonState === false ? reqq.amount : "-"}</td>
                      <td>
                        {reqq.buttonState === false ? reqq.state : "Done ✅"}
                      </td>
                      <td>
                        {reqq.buttonState === false && (
                          <Button
                            onClick={() => {
                              parentResponseToChildRequest(
                                reqq.id,
                                "Accept",
                                reqq.amount,
                                (s) => {
                                  // console.log("Req accepted");
                                  allReqArr[idx].buttonState = true;
                                  allReqArr[idx].buttonStatus =
                                    "Accepted Suceessfully";
                                  // let newReqArr = { ...allReqArr };
                                  setAllReqArr(allReqArr);
                                  setButtonState(true);
                                },
                                (e) => {
                                  console.log("func not success");
                                }
                              );

                              alert("Transation Accepted Suceessfully");

                              history.push("/");

                              // console.log(
                              //   allReqArr,
                              //   "Accepted........................."
                              // );
                              // {
                              //   navigate("/requestedMoney");
                              // }
                              // setButtonState(true);
                              // setButtonStatus("Acepted Suceessfully");
                            }}
                          >
                            Accept
                          </Button>
                        )}
                        {reqq.buttonState === false && (
                          <Button
                            style={{ marginLeft: "4px" }}
                            onClick={() => {
                              parentResponseToChildRequest(
                                reqq.id,
                                reqq.amount,
                                "Deny",
                                (s) => {
                                  // console.log("Req denied");
                                  allReqArr[idx].buttonState = true;
                                  allReqArr[idx].buttonStatus =
                                    "Denied Suceessfully";

                                  // let newReqArr = { ...allReqArr };
                                  setAllReqArr(allReqArr);
                                  setButtonState(true);
                                },
                                (e) => {
                                  console.log("func not success");
                                }
                              );
                              alert("Transation Denied Suceessfully");

                              history.push("/");
                              // console.log(
                              //   allReqArr,
                              //   "Denied........................."
                              // );
                            }}
                          >
                            Deny
                          </Button>
                        )}
                        {buttonState && <h4>{allReqArr[idx].buttonStatus}</h4>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody></tbody>
              )}
            </Table>
          </>
        )}
      </div>
      {/* {!loading ? (
        VasooliArr.length > 0 ? (
          VasooliArr.map((single, index) => (
            <Vasoolicard key={index} data={single} filter={SendToCardFilter} />
          ))
        ) : (
          <Empty />
        )
      ) : (
        <div className="w-100 d-flex justify-content-center">
          <Spinner
            animation="border"
            role="status"
            style={{ width: "70px", height: "70px", margin: "auto" }}
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )} */}
    </Fragment>
  );
}
