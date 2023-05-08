const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const path = require("path");
app.use(express.json());

const fileUpload = require("express-fileupload");
app.use(fileUpload());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

const PORT = process.env.PORT;
const dbURL = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const mongoDb = dbURL + dbName;

mongoose
  .connect(mongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected"))
  .catch((err) => console.log("Error : ", err));

const userRoute = require("./src/router/user");
app.use("/", userRoute);
const postRoute = require("./src/router/post");
app.use("/", postRoute);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
