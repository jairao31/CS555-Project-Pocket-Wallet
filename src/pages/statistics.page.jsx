import React, { Fragment, useState, useEffect } from "react";
import { getTransactionByFilter } from "./../firebase/transaction";
import fire from "./../firebase/fire";
import { useLocation } from "react-router-dom";
import categories from "./../data/categories";
// import { PieChart, Pie, Legend, Tooltip } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import loadingImg from "./../assets/img/Dash-Loading.gif";
import Empty from "./../components/general/empty.component";
import "./statistics.style.css";
import {
  getUserData,
  getCurrentUser,
  getAllTransactions,
  getUserDataForName,
  getAllTransactionsForChild,
} from "./../firebase/user";

export default function StatisticsV() {
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
      pd.forEach((element) => {
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
        });
      });
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
      {isParent === true ? (
        <>
          <h1>Parent Statistics</h1>
          <LineChart
            width={800}
            height={500}
            data={allTrans}
            // margin={{
            //   top: 5,
            //   right: 30,
            //   left: 20,
            //   bottom: 5,
            // }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" />
            <YAxis type="number" domain={[0, 200]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Amount"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </>
      ) : (
        <>
          <h1>Child Statistics</h1>
          <LineChart
            width={800}
            height={500}
            data={allTransChild}
            // margin={{
            //   top: 5,
            //   right: 30,
            //   left: 20,
            //   bottom: 5,
            // }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" />
            <YAxis type="number" domain={[0, 200]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Amount"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </>
      )}
    </Fragment>
  );
}
