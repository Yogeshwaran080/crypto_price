const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());

// Set up provider
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/f4602f599ad34d098930614e620c82f2`);
const contractAddress = '0x7B6ed5364Dd78F70E5BeCDe35B3808674a50D7b4';
const abi = [
  "function getLatestPrice() public view returns (int256)"
];
const contract = new ethers.Contract(contractAddress, abi, provider);

// Endpoint
app.get('/api/eth-price', async (req, res) => {
  try {
    const price = await contract.getLatestPrice();
    const formattedPrice = Number(price) / 1e8;
    res.json({ price: formattedPrice });
  } catch (err) {
    console.error(" Error fetching price:", err);
    res.status(500).json({ error: "Failed to fetch ETH price" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
