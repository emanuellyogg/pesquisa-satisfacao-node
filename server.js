const express = require("express");
const fs = require("fs");
const app = express();
const porta = 3001;
const cors = require('cors');

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
      "indelicado": calcularEstatistica(arrayPes, 2, "indelicado ")
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
      <li>Totalmente Atendida: ${resulPesq.a.totalmenteAtendida} %</li>
      <li>Parcialmente Atendida: ${resulPesq.a.parcialmenteAtendida} %</li>
      <li>Não foi Atendida: ${resulPesq.a.naoFoiAtendida} %</li>
    </ul>
  </div>

  <div>
    <ul><p><b>Pergunta B: Qual nota você daria para o atendimento?</b></p>
      <li>Excelente: ${resulPesq.b.excelente} %</li>
      <li>Bom: ${resulPesq.b.bom} %</li>
      <li>Aceitável: ${resulPesq.b.aceitavel} %</li>
      <li>Ruim: ${resulPesq.b.ruim} %</li>
      <li>Péssimo: ${resulPesq.b.pessimo} %</li>
    </ul>
  </div>

  <div>
    <ul><p><b>Pergunta C: Como você classificaria o comportamento do atendente?</b></p>
      <li>Muito Atencioso: ${resulPesq.c.muitoAtencioso} %</li>
      <li>Educado: ${resulPesq.c.educado} %</li>
      <li>Neutro: ${resulPesq.c.neutro} %</li>
      <li>Mau Humorado: ${resulPesq.c.mauHumorado} %</li>
      <li>Indelicado: ${resulPesq.c.indelicado} %</li>
    </ul>
  </div>

  <div>
    <ul><p><b>Pergunta D: De 0 à 10, qual nota você daria para o produto:</b></p>
      <li>De 0 a 4: ${resulPesq.d.zeroAquatro} %</li>
      <li>De 5 a 7: ${resulPesq.d.cincoAsete} %</li>
      <li>De 8 a 10: ${resulPesq.d.oitoAdez} %</li>
    </ul>
  </div>

  <div>
    <ul><p><b>Pergunta E: Informe sua idade:</b></p>
      <li>Menos de 15 anos: ${resulPesq.e.menosQuinze} %</li>
      <li>Entre 15 anos e 21 anos: ${resulPesq.e.quinzeEvinteUm} %</li>
      <li>Entre 22 anos e 35 anos: ${resulPesq.e.vinteDoisEtrintaCinco} %</li>
      <li>Entre 36 anos e 50 anos: ${resulPesq.e.trintaSeisEcinquenta} %</li>
      <li>Acima de 50 anos: ${resulPesq.e.maisCinquenta} %</li>
    </ul>
  </div>

  <div>
    <ul><p><b>Pergunta F: Informar seu gênero:</b></p>
      <li>Feminino: ${resulPesq.f.feminino} %</li>
      <li>Masculino: ${resulPesq.f.masculino} %</li>
    </ul>
  </div>
  
</body>
</html>
`
}