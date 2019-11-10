const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
// const port = process.env.PORT;

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use("/api", require("./routes/api"));

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    app
      .listen(3001, () => {
        console.log(`server started at http://localhost:${3001}`);
      })
      .on("error", console.log);
  })
  .catch(err => {
    console.log("Could not connect to database");
  });
