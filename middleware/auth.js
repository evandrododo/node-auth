const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Erro de autenticação" });

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.usuario = decoded.usuario;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Token inválido" });
  }
};
