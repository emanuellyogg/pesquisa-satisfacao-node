
var btnEnviar = document.getElementById("btnEnviar");
btnEnviar.addEventListener("click", async function () {

  var timePesquisa = pegarHoraPesquisa()
  var respostaA = document.querySelector("input[name=solAtend]:checked").value;
  var respostaB = document.querySelector("input[name=notaAtend]:checked").value;
  var respostaC = document.querySelector("input[name=compAtend]:checked").value;
  var respostaD = document.getElementById("idRange").value;
  var respostaE = Number(document.getElementById("age").value);
  var respostaF = document.querySelector("input[name=gender]:checked").value;

  const update = {
    respA: respostaA,
    respB: respostaB,
    respC: respostaC,
    respD: respostaD,
    respE: respostaE,
    respF: respostaF,
    timestamp: timePesquisa
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  };

  let response = await registrarPesquisa(options);
  exibirAlerta(response);
  limparTela();
});

async function registrarPesquisa(options) {
  let response = await fetch("http://localhost:3001/pesquisa", options);
  return response.json();
}

function pegarHoraPesquisa() {
  let timeAtual = new Date();

  let ano = timeAtual.getFullYear();
  let mes = (timeAtual.getMonth()) + 1;

  if (mes < 10) {
    mes = "0" + mes.toString();
  }

  let dia = timeAtual.getDate();

  if (dia < 10) {
    dia = "0" + dia.toString();
  }

  let hora = timeAtual.getHours();

  if (hora < 10) {
    hora = "0" + hora.toString();
  }

  let minuto = timeAtual.getMinutes();

  if (minuto < 10) {
    minuto = "0" + minuto.toString();
  }

  let segundos = timeAtual.getSeconds();

  if (segundos < 10) {
    segundos = "0" + segundos.toString();
  }

  let timeCompleto = ano.toString() + mes.toString() + dia.toString() + hora.toString() + minuto.toString() + segundos.toString();

  return timeCompleto;
}

function exibirAlerta(response) {
  if (response.Status == "200") {

    alertaSucesso();

  } else if (response.Status == "500") {

    alertaErro();
  }
}

function alertaSucesso() {
  let alertaSucesso = new bootstrap.Modal(document.getElementById("myModal"));
  alertaSucesso.show();
  let titModal = document.getElementById("tituloModal");
  titModal.classList.add("text-success", "fw-bold");
  titModal.innerText = "Enviado!";
  let textModal = document.getElementById("textoModal");
  textModal.classList.add("text-success", "fw-bold");
  textModal.innerText = "Pesquisa registrada com sucesso!";
  let btnModal = document.getElementById("btnModal");
  btnModal.classList.add("btn", "btn-success");

  setTimeout(function () {
    alertaSucesso.hide();
  }, 2000);
}

function alertaErro() {
  let alertaErro = new bootstrap.Modal(document.getElementById("myModal"));
  alertaErro.show();
  let titModal = document.getElementById("tituloModal");
  titModal.classList.add("text-danger", "fw-bold");
  titModal.innerText = "Erro!";
  let textModal = document.getElementById("textoModal");
  textModal.classList.add("text-danger", "fw-bold");
  textModal.innerText = "Erro ao registrar pesquisa, contate o administrador do sistema.";
  let btnModal = document.getElementById("btnModal");
  btnModal.classList.add("btn", "btn-danger");
}

function limparTela() {
  document.getElementById("solAtend3").checked = true;
  document.getElementById("notaAtend5").checked = true;
  document.getElementById("compAtend5").checked = true;
  document.getElementById("age").value = "";
  document.getElementById("idRange").value = "5";
  document.getElementById("idRadio2").checked = true;
}