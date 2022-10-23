const express = require('express');
const actorModel = require('../model/actor.model');
const router = express.Router();

module.exports = router;

router.get('/',async (req, res) => {
      const rows = await actorModel.findAll();
      res.json(rows);
})

router.post('/', async (req, res) => {
    const actor = req.body;
    console.log(req.body);
    //const result = await actorModel.add(actor);

    actor.actor_id = result[0];
    res.status(201).json(actor);
})
