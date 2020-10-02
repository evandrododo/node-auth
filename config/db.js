const mongoose = require("mongoose");

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true
    });
    console.log("Conectado ao MongoDB. ");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;