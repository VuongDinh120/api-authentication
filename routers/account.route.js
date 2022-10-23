const express = require('express');
const accountModel = require('../models/account.model');
const validate = require('../middlewares/validate.mdw');
const SCHEMA = require('../schemas/account.json');

const router = express.Router();

module.exports = router;

router.get('/', async (req, res) => {
    const rows = await accountModel.findAll();
    res.json(rows);
})

router.get('/:id', async function (req, res) {
    const id = +req.params.id || 0;
    const account = await accountModel.findById(id);
    if (account === null) {
        return res.status(204).end();
    }
    res.json(account);
})

router.post('/',validate(SCHEMA.add), async function (req, res) {
    const account = req.body;

    const result = await accountModel.add(account);

    account.account_id = result[0];
    res.status(201).json(account);
})

router.delete('/:id', async function (req, res) {
    const id = +req.params.id || 0;
    if (id === 0) {
        return res.json({
            message: 'NO account DELETED.'
        })
    }

    const affected_rows = await accountModel.del(id);
    if (affected_rows === 0) {
        return res.json({
            message: 'NO account DELETED.'
        })
    }

    res.json({
        message: 'account DELETED.'
    })
})

router.patch('/', validate(SCHEMA.update), async function (req, res) {
    const account = req.body;
    const id = account.account_id;
    delete account.account_id;
    const result = await accountModel.patch(id, account);
    res.json(result);
})