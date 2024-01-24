const router = require("express").Router();



const ApiSignIn = require("./api/Signin.routes");
const ApiSignUp = require("./api/Signup.routes");
const ApiLogOut = require("./api/Logout.routes");
const ApiCheck = require('./api/Check.routes');
const ApiQuestions= require('./api/Questions.routes');
const ApiPostman = require('./api/Postman.routes');


router.use("/api", ApiSignUp);
router.use("/api", ApiSignIn);
router.use("/api", ApiLogOut);

router.use('/api', ApiCheck);
router.use('/api', ApiPostman);

router.use('/api/questions', ApiQuestions);

module.exports = router;