const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  urlFoto: {
    type: String,
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("item", ItemSchema);