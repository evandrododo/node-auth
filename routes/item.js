const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const Item = require("../model/Item");

/**
 * @method - POST
 * @description - Cadastro de itens
 * @param - /item/cadastro
 */

router.post(
  "/cadastro",
  [
    check("titulo", "Insira um título válido").not().isEmpty(),
    check("urlFoto", "Insira uma foto válida").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { titulo, urlFoto } = req.body;
    try {
      item = new Item({
        titulo,
        urlFoto,
      });

      await item.save();

      res.status(200).json(item);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Erro ao salvar");
    }
  }
);


/**
 * @method - GET
 * @description - Retorna lista de itens
 * @param - /item/lista
 */

router.get("/lista", async (req, res) => {
  try {
    const itens = await Item.find();
    console.log(itens);
    res.json(itens);
  } catch (e) {
    res.send({ message: "Erro ao trazer itens" });
  }
});

module.exports = router;
