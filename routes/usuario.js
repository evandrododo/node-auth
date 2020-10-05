const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const jwtsecret = process.env.JWTSECRET;

const Usuario = require("../model/Usuario");
const auth = require("../middleware/auth");

/**
 * @method - POST
 * @param - /cadastro
 * @description - Cadastro de usuário
 */

router.post(
  "/cadastro",
  [
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

    const { username, email, password } = req.body;
    try {
      let usuario = await Usuario.findOne({
        email,
      });
      if (usuario) {
        return res.status(400).json({
          msg: "Usuário já existe",
        });
      }

      usuario = new Usuario({
        username,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);

      await usuario.save();

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
 * @method - POST
 * @param - /login
 * @description - Login do usuário
 */

router.post(
  "/login",
  [
    check("username", "Insira um usuário válido").not().isEmpty(),
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

    const { username, password } = req.body;
    try {
      let usuario = await Usuario.findOne({
        username,
      });
      if (!usuario) {
        usuario = await Usuario.findOne({
          email: username,
        });
      }
      if (!usuario)
        return res.status(400).json({
          message: "Usuário não existe",
        });

      const isMatch = await bcrypt.compare(password, usuario.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Senha inválida !",
        });

      const payload = {
        usuario: {
          id: usuario.id,
        },
      };

      jwt.sign(
        payload,
        jwtsecret,
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Erro no servidor",
      });
    }
  }
);

/**
 * @method - GET
 * @description - Retorna informações do usuário
 * @param - /user/me
 */

router.get("/me", auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    res.json(usuario);
  } catch (e) {
    res.send({ message: "Erro ao buscar usuário" });
  }
});

module.exports = router;
