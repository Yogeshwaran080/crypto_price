// server/index.js

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helmet = require('helmet');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "style-src": ["'self'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
    },
  })
);

const ETH_NODE_URL = process.env.ETH_NODE_URL;

app.post("/eth-mainnet", async (req, res) => {
  try {
    const { data } = await axios.post(ETH_NODE_URL, req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Blockchain request failed",
      message: error.message,
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`BlocNexus API server running at http://localhost:${PORT}`);
});
