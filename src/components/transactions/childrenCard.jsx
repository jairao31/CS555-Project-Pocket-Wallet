import React from "react";
import categories from "../../data/categories";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./transactioncard.style.css";
export default function ChildrenCard({ name, wallet, email }) {
  return (
    // <div
    //   className={
    //     "card text-center rounded-lg m-3 p-0 " +
    //     (type === "INC" ? "back-success" : "back-danger")
    //   }
    //   style={{ marginBottom: "4px" }}
    // >
    <div className="card-body d-flex">
      {/* <div className="btn img-col"> */}
      <i
        // className={`${categories[category].iconclass} imgIcon`}
        aria-hidden="true"
      ></i>
      <p
        className="text-bold amount"
        style={{
          fontWeight: "bold",
          background: "black",
          color: "white",
          padding: "2px",
          marginTop: "7px",
        }}
      >
        {name}
      </p>
      {/* </div> */}
      <div className="col-10 justify-content-start text-left">
        <h6 className="card-title m-0">
          <strong>Available Balance</strong>: ${wallet}
          <i aria-hidden="true" style={{ fontSize: "18px" }}></i>
        </h6>
        <small className="card-text" style={{ lineHeight: "1.2" }}>
          Email ID : {email}
        </small>

        {/* <hr className="m-1" />
        <p className="badge p-1 m-1 badge-info pull-right">
          <i
            className="fa fa-calendar m-1"
            aria-hidden="true"
            style={{ fontSize: "18px" }}
          ></i>
          {date.toLocaleString()}
        </p> */}
      </div>
    </div>
  );
}
