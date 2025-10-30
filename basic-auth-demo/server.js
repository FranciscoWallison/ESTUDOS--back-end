require("dotenv").config();
const express = require("express");
const app = express();

const USER = process.env.BASIC_USER || "admin";
const PASS = process.env.BASIC_PASS || "secret";

// Middleware Basic Auth
function basicAuth(req, res, next) {
  const hdr = req.headers["authorization"] || "";
  const [scheme, encoded] = hdr.split(" ");

  if (scheme !== "Basic" || !encoded) {
    res.set("WWW-Authenticate", 'Basic realm="demo"');
    return res.status(401).json({ error: "unauthorized" });
  }

  let decoded;
  try {
    decoded = Buffer.from(encoded, "base64").toString("utf8");
  } catch {
    res.set("WWW-Authenticate", 'Basic realm="demo"');
    return res.status(401).json({ error: "invalid_authorization" });
  }

  const idx = decoded.indexOf(":");
  if (idx < 0) {
    res.set("WWW-Authenticate", 'Basic realm="demo"');
    return res.status(401).json({ error: "invalid_format" });
  }

  const user = decoded.slice(0, idx);
  const pass = decoded.slice(idx + 1);

  if (user !== USER || pass !== PASS) {
    res.set("WWW-Authenticate", 'Basic realm="demo"');
    return res.status(401).json({ error: "invalid_credentials" });
  }

  return next();
}

app.get("/dados", basicAuth, (req, res) => {
  res.json({ ok: true, data: "recurso protegido via Basic Auth" });
});

app.listen(3000, () => {
  console.log("API ouvindo em http://localhost:3000");
});
