/*
  Exam6 -- build a Bulletin Board
  where logged in users can post comments
  and see the 10 most recent comments
*/
var express = require('express');
var router = express.Router();

const BugReport = require('../models/BugReport');

const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}

/* GET users listing. */
router.get('/exam6', 
  isLoggedIn,
  async (req, res, next)  => {
    const userId = res.locals.user._id;
    res.locals.bugReports= 
        await BugReport.find({})
    //res.json(res.locals.comments); 
    res.render('exam6/showBugReports');
});

router.post('/exam6',
  isLoggedIn,
  async (req,res,next) => {
    try{
        const {title,body} = req.body;
        const userId = res.locals.user._id;
        const createdAt = new Date();
        const bugReport = 
          new BugReport(
            {title,body,userId,createdAt});
        await bugReport.save();
        res.redirect('/exam6')

    } catch(e){
        next(e)
    }
  })

module.exports = router;