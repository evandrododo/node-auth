const mongoose = require("mongoose");

const ClienteSchema = mongoose.Schema({
  usuario: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  urlFoto: {
    type: String,
  },
  celular: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("cliente", ClienteSchema);