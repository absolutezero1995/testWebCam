const router = require("express").Router();

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: "Ошибка при удалении сессии" });
    }
    res.clearCookie("user_sid").json({ message: "Success" });
  });
});

module.exports = router;
