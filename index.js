require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./config/db");
connection();

app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

const prefix = "/twenty";

app.use(prefix + "/login", require("./routes/login"));
app.use(prefix + "/me", require("./routes/me"));

// User
app.use(prefix + "/user", require("./routes/user")); 

// Wallet Tossagun
app.use(prefix + "/tossagun/wallet", require("./routes/tossagun/wallet"));
app.use(prefix + "/tossagun/express", require("./routes/tossagun/express"));

const port = process.env.PORT || 2020;

app.listen(port, () => {
  console.log(`Project Twenty API Runing PORT ${port}`);
});
