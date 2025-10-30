const email = process.env.USER_EMAIL || "admin@example.com";
const password = process.env.USER_PASS || "s3nh@_forte";

(async () => {
  // login
  const loginRes = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const { token } = await loginRes.json();
  console.log("login:", loginRes.status, token ? "token recebido" : "falhou");

  // rota protegida
  const res = await fetch("http://localhost:3000/dados", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  console.log("dados:", res.status, body);
})();
