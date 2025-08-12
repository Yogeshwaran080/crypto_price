const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const PricesABI = require("./contracts/Prices.json");

const app = express();
app.use(cors());

const CONTRACT_ADDRESS = "0x69dd50F8607bc0D211D5E01C39F1B59F03835002";
const RPC_URL = "https://sepolia.infura.io/v3/f4602f599ad34d098930614e620c82f2";

const SYMBOLS = [
  "ETH", "BTC", "LINK", "USDC", "DAI", "AUD", "BTCETH", "BTC_ALT", "CSPX", "CZK",
  "EUR", "EUTBL_NAV", "FORTH", "Fidelity_ShortDuration", "GBP", "GHO", "IB01", "JPY",
  "LINKETH", "OETHETH", "PYUSD", "SNX", "SUSDE", "USDE", "USDG", "USDL", "USTB", "USTBL",
  "WSTETH", "XAU", "ZKSync_Healthcheck", "stETH_Proof_of_Reserves", "tfBILL_NAV"
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, PricesABI.abi, provider);

app.get("/", (req, res) => {
  res.send("Welcome to the Crypto Price API SaaS");
});

app.get("/price", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: "Missing 'symbol' query param" });
  if (!SYMBOLS.includes(symbol)) {
    return res.status(400).json({ error: "Unsupported symbol" });
  }

  try {
    const priceRaw = await contract.getLatestPrice(symbol);
    const price = ethers.formatUnits(priceRaw, 8);
    res.json({ symbol, price });
  } catch (e) {
    res.status(500).json({ error: "Feed not available or internal error" });
  }
});

app.get("/prices", async (req, res) => {
  try {
    const results = {};
    for (const sym of SYMBOLS) {
      try {
        const priceRaw = await contract.getLatestPrice(sym);
        results[sym] = ethers.formatUnits(priceRaw, 8);
      } catch {
        results[sym] = null;
      }
    }
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Crypto Price API server running on port ${PORT}`);
});
