import React from "react";
import emptyImg from "./../../assets/img/empty.jpg";
import "./empty.style.css";
export default function Empty() {
  return (
    <div className="m-auto p-2 d-flex flex-column justify-content-center align-items-center main-div">
      <img src={emptyImg} alt="" className="w-75" />
      <h5 className="alert text-center alert-warning m-1 p-1">
        No transactions yet
      </h5>
    </div>
  );
}
