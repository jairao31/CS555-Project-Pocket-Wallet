const express = require('express');
require('dotenv').config()
const app = express();
var cors = require("cors");
var options = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.use(cors(options));

var firebase = require('firebase-admin')

var serviceAccount = require('../service_account.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: "https://temp-ac2ca-default-rtdb.firebaseio.com"
});

// const session = require('express-session');
const configRoutes = require('../routes');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.use((req,res,next) => {
  console.log('Current Timestamp: ', new Date().toUTCString());
  console.log('Request Method: ', req.method);
  console.log('Request Route: ', req.originalUrl);
  next();
  // console.log(`User is${req.session.email ? "" : " not"} authenticated`)
})


app.listen(3001, () => {
  console.log("Server has been initialized!");
});


