const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../../db/models");

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        req.session.userId = user.id;
        req.session.admin = user.admin;
        res.status(200).json({ message: "Success", userId : req.session.userId });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
      console.error("Error during signin:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
