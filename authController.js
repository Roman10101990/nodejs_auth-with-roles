const User = require("./model/user.js");
const Role = require("./model/role.js");
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const key = process.env.KEY;

const getAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  };
  return jwt.sign(payload, key, { expiresIn: "1h" });
}

class AuthController {

  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Something went wrong...", errors })
      }

      const { userName, password } = req.body;
      const candidate = await User.findOne({ userName });
      if (candidate) {
        return res.status(400).json({ message: "User already exist" })
      }

      const hashedPassword = bcrypt.hashSync(password, 5);
      const userRole = await Role.findOne({ value: "ADMINISTRATOR" });

      const user = new User({ userName, password: hashedPassword, roles: [userRole.value] });
      await user.save();

      return res.json({ message: "User has been created" })
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" })
    }
  }

  async login(req, res) {
    try {
      const { userName, password } = req.body;
      const user = await User.findOne({ userName });

      if (!user) {
        return res.status(400).json({ message: "User doesnt exist" })
      }

      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(400).json({ message: "Password is not correct" })
      }

      const token = getAccessToken(user._id, user.roles)

      return res.json({ token })
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" })
    }
  }

  async getUsers(req, res) {
    try {
      // const userRole = new Role();
      // const adminRole = new Role({ value: "ADMINISTRATOR" });
      // const bossRole = new Role({ value: "BOSS" });
      // await userRole.save();
      // await adminRole.save();
      // await bossRole.save();

      const users = await User.find();
      res.json(users)
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new AuthController();