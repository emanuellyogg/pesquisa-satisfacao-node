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