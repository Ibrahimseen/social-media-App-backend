const express = require('express');
const post = require("./Routes/post");
const user = require("./Routes/user");
const cookieParser = require("cookie-parser")

const app = express();


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "Backend/config/config.env" });
}

//using middlewares// this is for parsing data
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());




app.use("/api/v1", post);
app.use("/api/v1", user);

module.exports = app;
