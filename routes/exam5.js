var express = require('express');
var router = express.Router();

const Contact = require('../models/Contact');

const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}

/* GET users listing. */
router.get('/exam5', 
  isLoggedIn,
  async (req, res, next)  => {
    const userId = res.locals.user._id;
    res.locals.contacts= await Contact.find({userId});
    res.render('exam5/showContacts');
});

router.post('/exam5',
  isLoggedIn,
  async (req,res,next) => {
    try{
        const {name,email,phone,comments} = req.body;
        const userId = res.locals.user._id;
        const contact = 
          new Contact(
            {name,email,phone,comments,userId});
        await contact.save();
        res.redirect('/exam5')

    } catch(e){
        next(e)
    }
  })

module.exports = router;