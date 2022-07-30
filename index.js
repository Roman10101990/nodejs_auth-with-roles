const express = require('express');
const server = express();
require('dotenv').config()
const mongoose = require("mongoose")

const router = require("./authRouter");
const PORT = process.env.PORT || 5000;


server.use(express.json());
server.use("/auth", router);

const start = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://<YOUR DB>>@cluster0.dsbca.mongodb.net/?retryWrites=true&w=majority')
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}...`))
  } catch (e) {
    console.log(e)
  }
}

start();