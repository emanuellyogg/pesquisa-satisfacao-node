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

    let listaPesquisa = data.split("\r\n");

    let ApuracaoPesquisa = [];

    for (let i = 0; i < listaPesquisa.length; i++) {
      const element = listaPesquisa[i];
      ApuracaoPesquisa.push(element.split(","));
      
    }

    console.log(ApuracaoPesquisa);
    resp.send(ApuracaoPesquisa);
  })
})