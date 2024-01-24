const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../../db/models");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);

    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        admin: false
      });
      req.session.userId = newUser.id;
      req.session.admin = newUser.admin;
      res.status(200).json({ message: "Success" });
    } else {
      res.status(400).json({ message: "User with this email already exists" });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
