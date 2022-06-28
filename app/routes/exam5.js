var express = require('express');
var router = express.Router();

const Contact = require('../models/Contact');


/* GET users listing. */
router.get('/exam5', 
  async (req, res, next)  => {
    res.locals.contacts= await Contact.find();
    res.render('exam5/showContacts');
});

router.post('/exam5',
  async (req,res,next) => {
    try{
        const {name,email,phone,comments} = req.body;
        const contact = new Contact({name,email,phone,comments});
        await contact.save();
        res.redirect('/exam5')

    } catch(e){
        next(e)
    }
  })

module.exports = router;