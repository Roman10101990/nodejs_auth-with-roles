const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware.js");
const roleMiddleware = require("./middleware/roleMiddleware.js");


router.post("/registration",
  [check("userName", "Cant be empty").notEmpty(),
  check("password", "Cant be empty").notEmpty()],
  controller.registration);

router.post("/login", controller.login);

router.get("/users", roleMiddleware(["ADMINISTRATOR"]), controller.getUsers);

module.exports = router;