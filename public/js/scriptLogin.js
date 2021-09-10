var btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener("click", async function () {

  var usuario = document.getElementById("idNameUser").value;
  var password = document.getElementById("idPassword").value;

  const update = {
    userId: usuario,
    senha: password
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  };

  let response = await verificarUser(options);
  console.log(response);
});

async function verificarUser(options) {
  let response = await fetch("http://localhost:3001/login", options);
  return response.json();
}