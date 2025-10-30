// npx -y concurrently -n srv,cli -c auto "node server.js" "npx -y wait-on tcp:3000 && node client.js"

require("dotenv").config();
const express = require("express");
const app = express();

const API_KEY = process.env.API_KEY;

// Middleware simples para checar x-api-key
function checkApiKey(req, res, next) {
  const key = req.header("x-api-key");
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

// Rota protegida por API Key
app.get("/dados", checkApiKey, (req, res) => {
  res.json({ ok: true, data: "exemplo de resposta protegida" });
});

app.listen(3000, () => {
  console.log("API ouvindo em http://localhost:3000");
});
