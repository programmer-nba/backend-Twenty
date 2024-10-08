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

// Shop
app.use(prefix + "/shop", require("./routes/shop/shop"));

// Wallet Shop
app.use(prefix + "/wallet", require("./routes/shop/wallet"));

// Wallet Tossagun
app.use(prefix + "/tossagun/wallet", require("./routes/tossagun/wallet"));

app.use(prefix + "/express", require("./routes/tossagun/express"));
app.use(prefix + "/artwork", require("./routes/tossagun/artwork"));
app.use(prefix + "/topup", require("./routes/tossagun/topup"));

// Receipt
app.use(prefix + "/receipt", require("./routes/more/receipt"));

const port = process.env.PORT || 2020;

app.listen(port, () => {
  console.log(`Project Twenty API Runing PORT ${port}`);
});
