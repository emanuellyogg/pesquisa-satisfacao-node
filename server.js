const express = require("express");
const fs = require("fs");
const app = express();
const porta = 3001;
const cors = require('cors');
const jwt = require("jsonwebtoken")
const SECRET = "SegredoPesquisa"

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.listen(porta, function () {
  console.log(`Servidor está rodando na porta: ${porta}`);
});

app.get("/", function (req, resp) {
  resp.sendFile(__dirname + "/view/index.html");
});

app.post("/pesquisa", function (req, resp) {

  let pesquisa = `${req.body.respA},${req.body.respB},${req.body.respC},${req.body.respD},${req.body.respE},${req.body.respF},${req.body.timestamp}`

  fs.appendFile("pesquisa.csv", `${pesquisa}\n`, function (err) {
    if (err) {
      resp.json({
        "Status": "500",
        "mensagem": "Erro ao registrar pesquisa, contate o administrador do sistema"
      }
      );
      throw err;
    } else {
      console.log("pesquisa registrada com sucesso");
      resp.json({
        "Status": "200",
        "mensagem": "pesquisa Registrado Com sucesso"
      }
      );
    }
  });
});

app.get("/estatisticas", function (req, resp) {

  fs.readFile("pesquisa.csv", "utf8", function (err, data) {

    if (err) {
      console.log(`Erro ao ler arquivo: ${err}`);
    }

    let listaPesquisa = data.split("\n");

    let ApuracaoPesquisa = [];

    for (let i = 0; i < listaPesquisa.length; i++) {
      const element = listaPesquisa[i];
      ApuracaoPesquisa.push(element.split(","));

    }

    let resultPesqPercentual = calculoApuracao(ApuracaoPesquisa)

    resp.send(resultPesqPercentual);
  });
});

function calculoApuracao(arrayPes) {

  return {
    "a": {
      "totalmenteAtendida": calcularEstatistica(arrayPes, 0, "totalmente atendida"),
      "parcialmenteAtendida": calcularEstatistica(arrayPes, 0, "parcialmente atendida"),
      "naoFoiAtendida": calcularEstatistica(arrayPes, 0, "não foi atendida")
    },
    "b": {
      "excelente": calcularEstatistica(arrayPes, 1, "excelente"),
      "bom": calcularEstatistica(arrayPes, 1, "bom"),
      "aceitavel": calcularEstatistica(arrayPes, 1, "aceitável"),
      "ruim": calcularEstatistica(arrayPes, 1, "ruim"),
      "pessimo": calcularEstatistica(arrayPes, 1, "péssimo")
    },
    "c": {
      "muitoAtencioso": calcularEstatistica(arrayPes, 2, "muito atencioso"),
      "educado": calcularEstatistica(arrayPes, 2, "educado"),
      "neutro": calcularEstatistica(arrayPes, 2, "neutro"),
      "mauHumorado": calcularEstatistica(arrayPes, 2, "mau humorado"),
      "indelicado": calcularEstatistica(arrayPes, 2, "indelicado")
    },
    "d": {
      "zeroAquatro": calcEstIntervalos(arrayPes, 3, 0, 4),
      "cincoAsete": calcEstIntervalos(arrayPes, 3, 5, 7),
      "oitoAdez": calcEstIntervalos(arrayPes, 3, 8, 10)
    },
    "e": {
      "menosQuinze": calcEstIntervalos(arrayPes, 4, 0, 15),
      "quinzeEvinteUm": calcEstIntervalos(arrayPes, 4, 15, 21),
      "vinteDoisEtrintaCinco": calcEstIntervalos(arrayPes, 4, 22, 35),
      "trintaSeisEcinquenta": calcEstIntervalos(arrayPes, 4, 36, 50),
      "maisCinquenta": calcEstIntervalos(arrayPes, 4, 50, 200)
    },
    "f": {
      "feminino": calcularEstatistica(arrayPes, 5, "Feminino"),
      "masculino": calcularEstatistica(arrayPes, 5, "Masculino")
    }
  }
}

function calcularEstatistica(arrayPes, pergunta, resp) {
  let total = 0;

  for (let i = 0; i < arrayPes.length; i++) {

    if (arrayPes[i][pergunta] == (resp)) {
      total++
    }
  }
  return calcPercentual(arrayPes.length - 1, total);
}

function calcEstIntervalos(arrayPes, pergunta, min, max) {
  let total = 0;

  for (let i = 0; i < arrayPes.length; i++) {

    let num = arrayPes[i][pergunta];

    if (num >= min && num <= max) {
      total++
    }
  }
  return calcPercentual(arrayPes.length - 1, total);;
}

function calcPercentual(totalPesq, totalResp) {
  let percent = (totalResp / totalPesq) * 100;
  return Number(percent.toFixed(1));
}

app.get("/relatorio", function (req, resp) {

  fs.readFile("pesquisa.csv", "utf8", function (err, data) {

    if (err) {
      console.log(`Erro ao ler arquivo: ${err}`);
    }

    let listaPesquisa = data.split("\n");

    let ApuracaoPesquisa = [];

    for (let i = 0; i < listaPesquisa.length; i++) {
      const element = listaPesquisa[i];
      ApuracaoPesquisa.push(element.split(","));

    }

    let resultPesqPercentual = calculoApuracao(ApuracaoPesquisa);
    resp.end(montaHTML(resultPesqPercentual));
  });
});

function montaHTML(resulPesq) {

  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

  <div>
    <h1> Relatório - Pesquisa Satisfação </h1>
  </div>

  <div>
    <ul><p><b>Pergunta A: Sua solicitação foi atendida?</b></p>
      <li>Totalmente Atendida: <b> ${resulPesq.a.totalmenteAtendida} %</b></li>
      <li>Parcialmente Atendida: <b> ${resulPesq.a.parcialmenteAtendida} %</b></li>
      <li>Não foi Atendida: <b> ${resulPesq.a.naoFoiAtendida} %</b></li>
    </ul>
  </div>

  <div>
    <ul><p><b>Pergunta B: Qual nota você daria para o atendimento?</b></p>
      <li>Excelente: <b> ${resulPesq.b.excelente} %</b></li>
      <li>Bom: <b> ${resulPesq.b.bom} %</b></li>
      <li>Aceitável: <b> ${resulPesq.b.aceitavel} %</b></li>
      <li>Ruim: <b> ${resulPesq.b.ruim} %</b></li>
      <li>Péssimo: <b> ${resulPesq.b.pessimo} %</b></li>
    </ul>
  </div>

  <div>
    <ul><p><b>Pergunta C: Como você classificaria o comportamento do atendente?</b></p>
      <li>Muito Atencioso: <b> ${resulPesq.c.muitoAtencioso} %</b></li>
      <li>Educado: <b> ${resulPesq.c.educado} %</b></li>
      <li>Neutro: <b> ${resulPesq.c.neutro} %</b></li>
      <li>Mau Humorado: <b> ${resulPesq.c.mauHumorado} %</b></li>
      <li>Indelicado: <b> ${resulPesq.c.indelicado} %</b></li>
    </ul>
  </div>

  <div>
    <ul><p><b>Pergunta D: De 0 à 10, qual nota você daria para o produto:</b></p>
      <li>De 0 a 4: <b> ${resulPesq.d.zeroAquatro} %</b></li>
      <li>De 5 a 7: <b> ${resulPesq.d.cincoAsete} %</b></li>
      <li>De 8 a 10: <b> ${resulPesq.d.oitoAdez} %</b></li>
    </ul>
  </div>

  <div>
    <ul><p><b>Pergunta E: Informe sua idade:</b></p>
      <li>Menos de 15 anos: <b> ${resulPesq.e.menosQuinze} %</b></li>
      <li>Entre 15 anos e 21 anos: <b> ${resulPesq.e.quinzeEvinteUm} %</b></li>
      <li>Entre 22 anos e 35 anos: <b> ${resulPesq.e.vinteDoisEtrintaCinco} %</b></li>
      <li>Entre 36 anos e 50 anos: <b> ${resulPesq.e.trintaSeisEcinquenta} %</b></li>
      <li>Acima de 50 anos: <b> ${resulPesq.e.maisCinquenta} %</b></li>
    </ul>
  </div>

  <div>
    <ul><p><b>Pergunta F: Informar seu gênero:</b></p>
      <li>Feminino: <b> ${resulPesq.f.feminino} %</b></li>
      <li>Masculino: <b> ${resulPesq.f.masculino} %</b></li>
    </ul>
  </div>
  
</body>
</html>
`
}

app.post("/login", function (req, resp) {

  if (req.body.user == "manu" && req.body.pass === 789456) {
    const token = jwt.sign({ xxx: req.body.user }, SECRET, { expiresIn: 120 });
    resp.json({ auth: true, token });
  }
  resp.status(401).end();
});

app.get("/usuario", verificarUser, function (req, resp) {

  resp.json({
    msn: "Usuário autenticado com sucesso",
    user: req.query.nmUser,
    codigoUser: req.query.nmCodUser
  });
});

function verificarUser(req, resp, next) {
  
  const token = req.header("x-access-token");
  jwt.verify(token, SECRET, function (err, decoded) {
    
    if (err) {
      resp.status(401).end();
    }

    req.dec = decoded.xxx;
    next();
  });
}