const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const Usuario = require("../model/Usuario");
const Cliente = require("../model/Cliente");

/**
 * @method - POST
 * @param - /cliente/cadastro
 * @description - Cadastro de usuário e cliente
 */

router.post(
  "/cadastro",
  [
    check("nome", "Insira um nome válido").not().isEmpty(),
    check("username", "Insira um usuário válido").not().isEmpty(),
    check("email", "Insira um email válido").isEmail(),
    check("password", "Insira uma senha válida").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password, nome, celular } = req.body;
    try {
      let usuario = await Usuario.findOne({
        email,
      });
      if (usuario) {
        return res.status(400).json({
          msg: "Usuário já existe",
        });
      }

      // Cria um novo usuário
      usuario = new Usuario({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);

      await usuario.save();

      // Cria um novo cliente referenciando o usuário
      console.log('usuarui', usuario)
      cliente = new Cliente({
        usuario: usuario._id,
        nome,
        celular,
      });

      await cliente.save();
      
      const payload = {
        usuario: {
          id: usuario.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Erro ao salvar");
    }
  }
);

/**
 * @method - GET
 * @description - Retorna informações do usuário
 * @param - /cliente/lista
 */

router.get("/lista", async (req, res) => {
  try {
    const clientes = await Cliente.find();
    
    // Exemplo de busca "relacional" por id, caso 
    // seja necessário trazer o usuario do cliente

    // const clientesFull = await Promise.all(clientes.map(async cliente => {
    //   usuarioFull = await Usuario.find({ _id: cliente.usuario})
    //   const cliRes = {
    //     cliente,
    //     usuarioFull,
    //   }
    //   return cliRes
    // }));
    // res.json(clientesFull);

    res.json(clientes);
  } catch (e) {
    res.send({ message: "Erro ao buscar clientes" });
  }
});

module.exports = router;
