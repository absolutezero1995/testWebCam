const router = require("express").Router();


router.get("/check", (req, res) => {
    if(req.session.userId) {
        res.json(true);
    } else {
        res.json(false);
    }
});

module.exports = router;
