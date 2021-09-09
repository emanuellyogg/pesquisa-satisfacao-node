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

    let resultPesqPercentual = getResultado(ApuracaoPesquisa)

    resp.send(resultPesqPercentual);
  });
});

function getResultado(arrayPes) {
  return {
    "a": {
      "totalmente atendida": calcularEstatistica(arrayPes, 0, "totalmente atendida") ,
      "parcialmente atendida": calcularEstatistica(arrayPes, 0, "parcialmente atendida"),
      "não foi atendida": calcularEstatistica(arrayPes, 0, "não foi atendida")
    },
    "b": {
      "excelente": calcularEstatistica(arrayPes, 1, "excelente"),
      "bom": calcularEstatistica(arrayPes, 1, "bom"),
      "aceitável": calcularEstatistica(arrayPes, 1, "aceitável"),
      "ruim": calcularEstatistica(arrayPes, 1, "ruim"),
      "péssimo": calcularEstatistica(arrayPes, 1, "péssimo")
    },
    "c": {
      "muito atencioso": calcularEstatistica(arrayPes, 2, "muito atencioso"),
      "educado": calcularEstatistica(arrayPes, 2, "educado"),
      "neutro": calcularEstatistica(arrayPes, 2, "neutro"),
      "mau humorado": calcularEstatistica(arrayPes, 2, "mau humorado "),
      "indelicado": calcularEstatistica(arrayPes, 2, "indelicado ")
    },
    "d": {
      "0 a 4": calcEstIntervalos(arrayPes, 3, 0, 4),
      "5 a 7": calcEstIntervalos(arrayPes, 3, 5, 7),
      "8 a 10": calcEstIntervalos(arrayPes, 3, 8, 10)
    },
    "e": {
      "menos de 15 anos": calcEstIntervalos(arrayPes, 4, 0, 15),
      "entre 15 e 21 anos": calcEstIntervalos(arrayPes, 4, 15, 21),
      "entre 22 e 35 anos": calcEstIntervalos(arrayPes, 4, 22, 35),
      "entre 36 e 50 anos": calcEstIntervalos(arrayPes, 4, 36, 50),
      "acima de 50 anos": calcEstIntervalos(arrayPes, 4, 50, 200)
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
      total ++
    }
  }
  // percent = (total / arrayPes.length-1) * 100;
  return calcPercentual(arrayPes.length-1, total);
}

function calcEstIntervalos(arrayPes, pergunta, min, max) {
  let total = 0;

  for (let i = 0; i < arrayPes.length; i++) {
    
    let num = arrayPes[i][pergunta];

    if (num >= min && num <= max) {
      total ++
    }
  }
  // percent = (total / arrayPes.length-1) * 100;
  return calcPercentual(arrayPes.length-1, total);;
} 

function calcPercentual(totalPesq, totalResp) {
  let percent = (totalResp / totalPesq) * 100;
  return percent.toFixed(1);
}