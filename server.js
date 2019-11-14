const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./config.prod");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

app.use("/api", require("./routes/api"));

mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => {
    app
      .listen(PORT, () => {
        console.log(`server started at http://localhost:${PORT}`);
      })
      .on("error", console.log);
  })
  .catch(err => {
    console.log("Could not connect to database");
  });
