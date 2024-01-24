const { User } = require("../db/models");

async function getUser(req, res, next) {
  if (req.session.user_sid) {
    const user = await User.findOne({ where: { id: req.session.user_sid } });
    res.locals.user = { id: user.id, name: user.name };
  }
  next();
}

module.exports = getUser;
