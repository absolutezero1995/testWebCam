const router = require("express").Router();
const {Question, Category} = require('../../db/models');



router.get("/", async (req, res) => {
    try {
        const categories = await Category.findAll({include: Question});
        res.json(categories);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;