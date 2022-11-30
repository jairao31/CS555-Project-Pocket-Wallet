import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { imgArr } from "./../../data/userimages";
import { FBlogout } from "./../../firebase/user";
import { Button } from "react-bootstrap";
import fire from "../../firebase/fire";
import { getUserData } from "./../../firebase/user";
import "./sidebar.style.css";
const IconStyling = {
  fontSize: "25px",
  margin: "0 5px",
};

export default function SidebarV({ control, cleanuser, user, loggedin, dp }) {
  const [select, setSelect] = useState("");
  const [userObj, setUserObj] = useState({});
  const [isParent, setIsParent] = useState(false);
  const [loading, setloading] = useState(true);

  const getDataFromFB = () => {
    setloading(true);
    let user = fire.auth().currentUser;
    getUserData(
      user?.uid,
      (s) => {
        let userD = s;
        setUserObj(userD);
        if (userD.children.length) {
          setIsParent(true);
        } else {
          setIsParent(false);
        }
      },
      (err) => {
        // console.log(err);
      }
    );
  };

  useEffect(() => {
    getDataFromFB();
  }, []);

  const logout = () => {
    FBlogout(
      () => {
        //Sucess Function
        //console.log("Log Out Successful");
        cleanuser();
      },
      () => {
        //Error Function
        // console.log("Error Occured");
      }
    );
  };

  // console.log("isparernt check", isParent, userObj);

  return (
    <div
      className="card"
      style={{ width: "250px", background: "white", height: "100vh" }}
    >
      <div className="card-body">
        {loggedin ? (
          <Fragment>
            <img
              className="card-img-top"
              src={imgArr[parseInt(dp)]}
              alt="Card image cap"
              id={user.uid}
              style={{
                borderRadius: "50%",
                width: "60%",
                margin: "3vh 19%",
              }}
            />
            <p
              className="card-title d-flex justify-content-center"
              style={{ fontWeight: "bold" }}
            >
              {user.email}
            </p>
          </Fragment>
        ) : (
          <Fragment>
            <Link
              to="/signup"
              onClick={() => control(false)}
              className="button-89 btn btn-warning m-1"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              onClick={() => control(false)}
              className=" button-89 btn btn-warning m-1"
            >
              Log In
            </Link>
          </Fragment>
        )}
        {/* <hr /> */}
        {loggedin && (
          <div className="card-text">
            <ul className="list-group list-group-flush">
              <Link
                to="/dashboard"
                className="list-group-item"
                onClick={() => {
                  control(false);
                  setSelect("dashboard");
                }}
              >
                <i className="fa fa-home" style={IconStyling}></i>
                {select === "dashboard" ? (
                  <strong
                    style={{
                      color: "#ae4825",
                      textShadow:
                        "0 0 20px #ae4825,0 0 80px #ae4825, 0 0 90px #ae4825, 0 0 100px #ae4825,   0 0 150px #ae4825",
                    }}
                  >
                    Home
                  </strong>
                ) : (
                  <strong>Home</strong>
                )}
              </Link>
              <Link
                to="/transactions"
                className="list-group-item"
                onClick={() => {
                  control(false);
                  setSelect("Transactions");
                }}
              >
                <i class="fa fa-exchange" style={IconStyling}></i>
                {select === "Transactions" ? (
                  <strong
                    style={{
                      color: "#ae4825",
                      textShadow:
                        "0 0 20px #ae4825,0 0 80px #ae4825, 0 0 90px #ae4825, 0 0 100px #ae4825,   0 0 150px #ae4825",
                    }}
                  >
                    Transactions
                  </strong>
                ) : (
                  <strong>Transactions</strong>
                )}
              </Link>
              {/* {isParent === true && ( */}
              <Link
                to="/myChild"
                className="list-group-item"
                onClick={() => {
                  control(false);
                  setSelect("MyChild");
                }}
              >
                <i className="fa fa-child" style={IconStyling}></i>
                {select === "MyChild" ? (
                  <strong
                    style={{
                      color: "#ae4825",
                      textShadow:
                        "0 0 20px #ae4825,0 0 80px #ae4825, 0 0 90px #ae4825, 0 0 100px #ae4825,   0 0 150px #ae4825",
                    }}
                  >
                    My Child
                  </strong>
                ) : (
                  <strong>My Child</strong>
                )}
              </Link>
              {/* )} */}
              {/* {isParent === true && ( */}
              <Link
                to="/allocate"
                className="list-group-item"
                onClick={() => {
                  control(false);
                  setSelect("allocate");
                }}
              >
                <i className="fa fa-handshake-o" style={IconStyling}></i>
                {select === "allocate" ? (
                  <strong
                    style={{
                      color: "#ae4825",
                      textShadow:
                        "0 0 20px #ae4825,0 0 80px #ae4825, 0 0 90px #ae4825, 0 0 100px #ae4825,   0 0 150px #ae4825",
                    }}
                  >
                    Allocate Money
                  </strong>
                ) : (
                  <strong>Allocate Money</strong>
                )}
              </Link>
              {/* )} */}

              {/* {isParent === true && ( */}
              <Link
                to="/split"
                className="list-group-item"
                onClick={() => {
                  control(false);
                  setSelect("split");
                }}
              >
                <i className="fa fa-handshake-o" style={IconStyling}></i>
                {select === "split" ? (
                  <strong
                    style={{
                      color: "#ae4825",
                      textShadow:
                        "0 0 20px #ae4825,0 0 80px #ae4825, 0 0 90px #ae4825, 0 0 100px #ae4825,   0 0 150px #ae4825",
                    }}
                  >
                    Split Money
                  </strong>
                ) : (
                  <strong>Split Money</strong>
                )}
              </Link>
              {/* )} */}

              <Link
                to="/requestedMoney"
                className="list-group-item"
                onClick={() => {
                  control(false);
                  setSelect("requestedMoney");
                }}
              >
                <i className="fa fa-money" style={IconStyling}></i>
                {select === "requestedMoney" ? (
                  <strong
                    style={{
                      color: "#ae4825",
                      textShadow:
                        "0 0 20px #ae4825,0 0 80px #ae4825, 0 0 90px #ae4825, 0 0 100px #ae4825,   0 0 150px #ae4825",
                    }}
                  >
                    Request Money
                  </strong>
                ) : (
                  <strong>Request Money</strong>
                )}
              </Link>
              <Link
                to="/profile"
                className="list-group-item"
                onClick={() => {
                  control(false);
                  setSelect("Profile");
                }}
              >
                <i className="fa fa-user" style={IconStyling}></i>
                {select === "Profile" ? (
                  <strong
                    style={{
                      color: "#ae4825",
                      textShadow:
                        "0 0 20px #ae4825,0 0 80px #ae4825, 0 0 90px #ae4825, 0 0 100px #ae4825,   0 0 150px #ae4825",
                    }}
                  >
                    My Profile
                  </strong>
                ) : (
                  <strong>My Profile</strong>
                )}
              </Link>
              <Link
                to="/statistics"
                className="list-group-item"
                onClick={() => {
                  control(false);
                  setSelect("statistics");
                }}
              >
                <i className="fa  fa-pie-chart" style={IconStyling}></i>
                {select === "statistics" ? (
                  <strong
                    style={{
                      color: "#ae4825",
                      textShadow:
                        "0 0 20px #ae4825,0 0 80px #ae4825, 0 0 90px #ae4825, 0 0 100px #ae4825,   0 0 150px #ae4825",
                    }}
                  >
                    Statistics
                  </strong>
                ) : (
                  <strong>Statistics</strong>
                )}
              </Link>
            </ul>
          </div>
        )}
        <hr />
        {loggedin ? (
          <Button
            onClick={logout}
            className="button-89 btn btn-outline-danger text-danger w-75 m-auto bg-white d-flex justify-content-center"
          >
            <strong>Log out</strong>
          </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
