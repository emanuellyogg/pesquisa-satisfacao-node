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

  var response = await fetch("http://localhost:3001/login", options);
  var autentic = await response.json();
  
  localStorage.removeItem("token");
  localStorage.setItem("token", autentic.token);
  
  console.log(response);
});
