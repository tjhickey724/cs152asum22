/*
  cloudStorage.js - this is like asyncStorage 
  but requires an email address and stores key/value data in the cloud.
  This version does not have any authentication or validation of the email address.
*/
const express = require('express');
const router = express.Router();
const CloudData = require('../models/CloudData');

/* store key/value pair in the collection for the user with specified email */
router.post('/cloud/store', 
    async (req, res, next)  => {
        const {email,key,value} = req.body;
        console.log('in /cloud/store');
        console.dir({email,key,value});
        const cloudData = new CloudData({email,key,value})
        await cloudData.save()
        res.json({id:cloudData.id})
});

/* get the list of all values associated with the particular email and key */
router.post('/cloud/get',
    async (req, res, next)  => {
        console.log('in /cloud/get');
        console.dir(req.body);
        const {email,key} = req.body;
        const cloudData = await CloudData.find({email,key})
        res.json(cloudData);
});

/* remove all key/values pairs for the specified email */
router.post('/cloud/clear',
    async (req, res, next)  => {
        const {email} = req.body;
        const cloudData = await CloudData.deleteMany({email})
        res.json(cloudData);
    }
)

/* remove all key/values pairs for the specified email */
router.get('/cloud/showAll',
    async (req, res, next)  => {
        const cloudData = await CloudData.find({})
        res.json(cloudData);
    }
)


module.exports = router;
