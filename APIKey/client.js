const API_KEY = "uma_chave_bem_longa_e_imprevisivel"; // para demo
const url = "http://localhost:3000/dados";

(async () => {
  const res = await fetch(url, {
    headers: { "x-api-key": API_KEY },
  });
  const body = await res.json();
  console.log(res.status, body);
})();
