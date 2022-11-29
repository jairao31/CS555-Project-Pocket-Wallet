import React, { Fragment, useState, useEffect } from "react";
import { getTransactionByFilter } from "./../firebase/transaction";
import fire from "./../firebase/fire";
import { useLocation, useHistory } from "react-router-dom";
import categories from "./../data/categories";
import { PieChart, Pie, Legend, Tooltip } from "recharts";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import loadingImg from "./../assets/img/Dash-Loading.gif";
import Empty from "./../components/general/empty.component";
import "./dashboard.style.css";
import TypeWriterEffect from "react-typewriter-effect";
import MyParticles from "./particles";
import { getAllUser, getUserData, addMoney } from "../firebase/user";

export default function DashboardV() {
  const [allUser, setAllUser] = useState([]);
  const [userObj, setUserObj] = useState({});
  const [userType, setUserType] = useState("");
  const [loading, setloading] = useState(true);
  const [amount, setAmount] = useState(0);

  const history = useHistory();

  // useEffect(()=> {
  //   const res = getAllUser()
  //   if(res.data !== undefined){
  //     console.log(res)
  //     setAllUser(res.data)
  //   }

  // },[])

  const getDataFromFB = () => {
    setloading(true);
    let user = fire.auth().currentUser;
    getUserData(
      user?.uid,
      (s) => {
        let userD = s;
        setUserObj(userD);
        if (userD.children.length) {
          setUserType("Parent");
        } else {
          setUserType("Child");
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

  // console.log("dashhhhh------", userType, userObj);

  // console.log("-------------"+allUser)
  // const [TransactionsArr, setTransactionsArr] = useState([]);
  // const [IncomePieData, setIncomePieData] = useState([]);
  // const [ExpensePieData, seExpensePieData] = useState([]);
  // const [netIncome, setnetIncome] = useState(0);
  // const [netExpense, setnetExpense] = useState(0);
  // const [monthdata, setmonthdata] = useState([]);
  // const [categorywise, setcategorywise] = useState([]);
  // const [PieDim, setPieDim] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // const [BarDim, setBarDim] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // const [loading, setloading] = useState(true);
  // const [user, setuser] = useState({});
  // let loc = useLocation();

  // const BarDataMaking = (TransactionsArr) => {
  //   let inc = [0, 0, 0, 0, 0, 0];
  //   let exp = [0, 0, 0, 0, 0, 0];
  //   const monthArr = [
  //     "Jan-Feb",
  //     "Mar-Apr",
  //     "May-Jun",
  //     "Jul-Aug",
  //     "Sep-Oct",
  //     "Nov-Dec",
  //   ];
  //   TransactionsArr.map((trans) => {
  //     if (trans.type === "INC") {
  //       let dt = new Date(trans.date);
  //       let month = dt.getMonth();
  //       inc[parseInt(month / 2)] += parseInt(trans.amount);
  //     } else if (trans.type === "EXP") {
  //       let dt = new Date(trans.date);
  //       let month = dt.getMonth();
  //       exp[parseInt(month / 2)] += parseInt(trans.amount);
  //     }
  //   });
  //   //    console.log(inc, exp);
  //   let bardata = [];
  //   for (let i in inc) {
  //     bardata.push({
  //       Months: monthArr[i],
  //       Income: inc[i],
  //       Expense: exp[i],
  //     });
  //   }
  //   setmonthdata(bardata);
  // };

  // const PieDataMaking = (TransactionsArr) => {
  //   let inc = [0, 0, 0],
  //     exp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  //   //console.log(TransactionsArr);
  //   TransactionsArr.map((trans) => {
  //     if (trans.type === "INC") {
  //       let catIndex = parseInt(trans.category);
  //       inc[catIndex] += parseInt(trans.amount);
  //     } else if (trans.type === "EXP") {
  //       let catIndex = parseInt(trans.category) - 3;
  //       exp[catIndex] += parseInt(trans.amount);
  //     }
  //   });
  //   //console.log(inc, exp);
  //   let incObjArr = [],
  //     expObjArr = [],
  //     incSum = 0,
  //     expSum = 0;
  //   inc.map((d, index) => {
  //     let obj = {
  //       name: categories[index].title,
  //       value: d,
  //     };
  //     incSum += d;
  //     //console.log(obj);
  //     incObjArr.push(obj);
  //   });
  //   exp.map((d, index) => {
  //     expObjArr.push({
  //       name: categories[index + 3].title,
  //       value: d,
  //     });
  //     expSum += d;
  //   });
  //   //console.log(incObjArr, expObjArr);
  //   setIncomePieData(incObjArr);
  //   seExpensePieData(expObjArr);
  //   setnetIncome(incSum);
  //   setnetExpense(expSum);
  //   setcategorywise(inc.concat(exp));
  // };

  // useEffect(() => {
  //   setloading(true);
  //   if (window.innerWidth > 810) {
  //     //Desktop
  //     setPieDim({
  //       width: window.innerWidth / 4,
  //       height: window.innerHeight / 2,
  //     });
  //     setBarDim({
  //       width: window.innerWidth * 0.7,
  //       height: window.innerHeight * 0.4,
  //     });
  //   } else {
  //     setPieDim({
  //       width: window.innerWidth * 0.8,
  //       height: window.innerHeight / 2,
  //     });
  //     setBarDim({
  //       width: window.innerWidth * 0.98,
  //       height: window.innerHeight * 0.3,
  //     });
  //   }
  //   fire.auth().onAuthStateChanged(function (user) {
  //     if (user) {
  //       setuser(user);
  //       getTransactionByFilter(
  //         user.uid,
  //         "ALL",
  //         (res) => {
  //           let Arr = [];
  //           res.forEach((item) => {
  //             Arr.push(item.data());
  //           });
  //           //            console.log(Arr);

  //           setTransactionsArr(Arr);
  //           PieDataMaking(Arr);
  //           BarDataMaking(Arr);
  //           setloading(false);
  //         },
  //         (err) => console.log(err)
  //       );
  //     } else {
  //       //console.log("NO user AUth Change");
  //     }
  //   });
  // }, [loc.pathname]);

  // console.log(amount);
  return (
    <>
      <MyParticles />
      <div className="dashTab">
        <div class="banner-area">
          <div class="text-area">
            <TypeWriterEffect
              textStyle={{
                color: "#FFF",
                fontWeight: 500,
                fontSize: "2.5em",
              }}
              startDelay={2000}
              cursorColor="#3F3D56"
              multiText={[
                `Welcome back, ${userObj.name} !!!`,
                `You are a ${userType} User`,
              ]}
              multiTextLoop={true}
              multiTextDelay={1000}
              typeSpeed={30}
            />

            <h3>Your Wallet Balance is {userObj.wallet}</h3>

            {/* <h2>John Doe</h2>
            <h3>Web Designer</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
              fuga laudantium quibusdam sequi totam veniam?
            </p> */}
          </div>
        </div>
        <br />
        {userType === "Parent" && (
          <div style={{ display: "flex" }}>
            <input
              type="number"
              className="form-control"
              placeholder="Add money to wallet"
              onChange={(e) => setAmount(e.target.value)}
            ></input>
            <button
              className="btn btn-info mx-1"
              onClick={() => {
                addMoney(
                  amount,
                  (s) => {
                    console.log("Money added to your wallet successfully");
                    alert("Money added to your wallet successfully");
                    history.push("/");
                    setAmount(0);
                  },
                  (e) => {
                    console.log("req failed");
                  }
                );
              }}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </>
  );
}
