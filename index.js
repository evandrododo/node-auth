const express = require("express");
const bodyParser = require("body-parser");
const usuario = require("./routes/usuario");
const item = require("./routes/item");
const cliente = require("./routes/cliente");
const cors = require("cors");
const InitiateMongoServer = require("./config/db");

InitiateMongoServer();

const app = express();
app.use(cors());

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

/**
 * Router Middleware
 * Router - /item/*
 * Method - *
 */
app.use("/item", item);

/**
 * Router Middleware
 * Router - /cliente/*
 * Method - *
 */
app.use("/cliente", cliente);

app.listen(PORT, (req, res) => {
  console.log(`Servidor disponível na porta ${PORT}`);
});

