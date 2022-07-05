/*
  Exam6-API -- Lookup recipes starting with a given letter
*/
var express = require('express');
var router = express.Router();
const axios = require('axios');


/* GET users listing. */
router.get('/exam6API', 
  async (req, res, next)  => {
    res.render('exam6/showMealsForm');
});


router.post('/exam6API',
  async (req,res,next) => {
    const {letter} = req.body;
    const url="https://www.themealdb.com/api/json/v1/1/search.php?f="+letter;
    //const url="https://www.themealdb.com/api/json/v1/1/filter.php?i="+ingredient
    const response = await axios.get(url)
    console.dir(response.data)
    res.locals.letter = letter
    res.locals.meals = response.data.meals || []
    res.render('exam6/showMealsByLetter')
  })


module.exports = router;