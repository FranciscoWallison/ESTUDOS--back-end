require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const { PORT = 3000, JWT_SECRET, TOKEN_TTL = "15m" } = process.env;
const USER_EMAIL = process.env.USER_EMAIL || "admin@example.com";
const USER_PASS = process.env.USER_PASS || "secret";

// POST /login -> retorna JWT
app.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email !== USER_EMAIL || password !== USER_PASS) {
    return res.status(401).json({ error: "invalid_credentials" });
  }

  const payload = {
    sub: "user-1",
    email,
    role: "admin",
    perms: ["read:data"],
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
    issuer: "jwt-demo",
  });

  res.json({ token });
});

// Middleware Bearer JWT
function auth(req, res, next) {
  const h = req.header("authorization") || "";
  const [scheme, token] = h.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "missing_token" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET, { issuer: "jwt-demo" });
    return next();
  } catch (e) {
    return res.status(401).json({ error: "invalid_token" });
  }
}

// Rota protegida
app.get("/dados", auth, (req, res) => {
  res.json({
    ok: true,
    by: req.user.email,
    data: "recurso protegido via JWT",
    exp: req.user.exp,
  });
});

app.listen(PORT, () => {
  console.log(`API ouvindo em http://localhost:${PORT}`);
});

/*
# login
TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "content-type: application/json" \
  -d '{"email":"admin@example.com","password":"s3nh@_forte"}' | jq -r .token)

# rota protegida
curl -H "authorization: Bearer $TOKEN" http://localhost:3000/dados
*/