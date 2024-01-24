const router = require("express").Router();


router.get("/postman", (req, res) => {
    if(req.session.userId) {
        res.json('ПОЛНЫЙ ТРУ');
    } else {
        res.json('ПОЛНЫЙ ФОЛС');
    }
});

module.exports = router;