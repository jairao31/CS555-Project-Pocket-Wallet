import React, { Fragment, useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Link, useLocation } from "react-router-dom";
import { getVasooliByFilter } from "./../firebase/vasooli";
import fire from "./../firebase/fire";
import Vasoolicard from "./../components/allocateMoney/vasoolicard";
import Empty from "./../components/general/empty.component";
import ChildrenCard from "../components/transactions/childrenCard";
import { getUserDataForName, getUserData } from "../firebase/user";

export default function MyChild() {
  const [userObj, setUserObj] = useState({});
  const [isParent, setIsParent] = useState(false);
  const [loading, setloading] = useState(true);
  const [childArr, setChildArr] = useState([]);

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
        console.log(err);
      }
    );
  };

  useEffect(() => {
    getDataFromFB();
  }, []);

  useEffect(() => {
    let cArr = [];
    userObj.children?.forEach(async (ch, idx) => {
      await getUserDataForName(ch).then((reso) => {
        if (reso !== null) {
          cArr.push(reso);
        }
        if (idx === userObj.children.length - 1) {
          setChildArr(cArr);
          return;
        }
      });
    });
  }, [userObj]);

  // console.log(childArr);

  return (
    <Fragment>
      {isParent === true ? (
        <>
          <h3>List Of My Child</h3>
          <div className="col" style={{ marginBottom: "7px" }}>
            {childArr &&
              childArr.length > 0 &&
              childArr?.map((ch, idx) => (
                <>
                  <ChildrenCard
                    key={idx}
                    name={ch.name}
                    wallet={ch.wallet}
                    email={ch.email}
                  />
                  <br />
                </>
              ))}
          </div>
          <Link to="/addChild" className="btn btn-success mx-1">
            Add New Child
            <i className="fa fa-plus mx-1"></i>
          </Link>
        </>
      ) : (
        <div>child logged in....</div>
      )}
    </Fragment>
  );
}
