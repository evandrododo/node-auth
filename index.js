const express = require("express");
const bodyParser = require("body-parser");
const usuario = require("./routes/usuario");
const InitiateMongoServer = require("./config/db");

InitiateMongoServer();

const app = express();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */

app.use("/usuario", usuario);

app.listen(PORT, (req, res) => {
  console.log(`Servidor disponível na porta ${PORT}`);
});

