const express = require('express');
const base64 = require('base-64');
const utf8 = require('utf8');

const accountModel = require('../models/account.model');
const validate = require('../middlewares/validate.mdw');
const SCHEMA = require('../schemas/auth.json');
// const authentication = require('../middlewares/auth.mdw');

const router = express.Router();

module.exports = router;

//Basic auth login
// router.post('/login', validate(SCHEMA.LOGIN), async (req, res) => {
//     //Login a registered user
//     const account = await accountModel.findByCredentials(req.body);
//     return account ? res.json(account) : res.status(400).json({ message: 'Username or password is incorrect' });
// })

// Secret Key auth login
router.post('/login', validate(SCHEMA.LOGIN), async (req, res) => {
    //Login a registered user
    const account = await accountModel.findByCredentials(req.body);
    if (!account) {
        return res.status(400).json({ message: 'Username or password is incorrect' });
    }
    const encode = Buffer.from(process.env.SECRET_KEY).toString('base64');
    return res.json({
        account: account,
        secret_key: encode
    });
})