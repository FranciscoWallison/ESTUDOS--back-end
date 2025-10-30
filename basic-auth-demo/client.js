const user = process.env.BASIC_USER || "admin";
const pass = process.env.BASIC_PASS || "s3nh@_forte";
const token = Buffer.from(`${user}:${pass}`).toString("base64");

(async () => {
  const res = await fetch("http://localhost:3000/dados", {
    headers: { Authorization: `Basic ${token}` },
  });
  const body = await res.json();
  console.log(res.status, body);
})();
