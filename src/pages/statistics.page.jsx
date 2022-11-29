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
import { getAllTransactions } from "../firebase/user";

export default function StatisticsV() {
  const [allTrans, setAllTrans] = useState([]);
  const graphData = [];
  useEffect(() => {
    async function getmyTransactions() {
      let user = fire.auth().currentUser;
      let pd = await getAllTransactions(user.uid);
      pd.forEach((element) => {
        const dateFormat = new Date(1970, 0, 1);
        dateFormat.setSeconds(element.timestamp.seconds);
        // console.log(dateFormat);
        // console.log(
        //   dateFormat.getMonth() +
        //     1 +
        //     "/" +
        //     dateFormat.getDate() +
        //     "/" +
        //     dateFormat.getFullYear()
        // );
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
      // setParentID(pd);
      // setReqM((prev) => {
      //   return {
      //     ...prev,
      //     receiver_id: pd,
      //   };
      // });
    }
    getmyTransactions();
  }, []);

  return (
    <Fragment>
      <h1>User Statistics</h1>
      <LineChart
        width={1200}
        height={700}
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
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Amount"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        {/* <Line type="monotone" dataKey="amount" stroke="#82ca9d" /> */}
      </LineChart>
      {/* {loading ? (
        <img src={loadingImg} className="w-100 m-auto" />
      ) : (
        <Fragment>
          <div className="row">
            <div className="col-6 card alert-success">
              <h5>Net Income : {netIncome}</h5>
            </div>
            <div className="col-6 card alert-danger">
              <h5>Net Expenses : {netExpense}</h5>
            </div>
          </div>
          {TransactionsArr.length === 0 ? (
            <Empty />
          ) : (
            <div className="row p-2 d-flex flex-col justify-content-center">
              <h5>Monthwise Income and Expenses</h5>
              <BarChart
                width={BarDim.width}
                height={BarDim.height}
                data={monthdata}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Months" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Income" fill="	#5cb85c" />
                <Bar dataKey="Expense" fill="#d9534f" />
              </BarChart>
            </div>
          )}
          <div className="row">
            <div className="col-md-6 card p-2">
              <h5 className="">Category Wise Spends</h5>
              <ul className="list-group">
                {categories.map((cat, i) => (
                  <li key={i} className="list-group-item d-flex flex-row p-1">
                    <i
                      className={`${cat.iconclass} mx-2`}
                      style={{ fontSize: "25px" }}
                    ></i>

                    <h6 className="para-width">{cat.title} - </h6>
                    <div
                      className={`badge-width badge justify-selff-end p-2 badge-${
                        i > 3 ? "danger" : "success"
                      }`}
                    >
                      ${categorywise[i]}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {TransactionsArr.length !== 0 ? (
              <div className="col-md-6 card p-2">
                <PieChart width={PieDim.width + 20} height={PieDim.height + 20}>
                  <Pie
                    data={IncomePieData}
                    dataKey="value"
                    cx={PieDim.width / 2}
                    cy={PieDim.height / 2}
                    outerRadius={75}
                    fill="	#5cb85c"
                  />
                  <Pie
                    data={ExpensePieData}
                    dataKey="value"
                    cx={PieDim.width / 2}
                    cy={PieDim.height / 2}
                    innerRadius={95}
                    outerRadius={120}
                    fill="#d9534f"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </div>
            ) : (
              ""
            )}
          </div>
        </Fragment>
      )} */}
    </Fragment>
  );
}
