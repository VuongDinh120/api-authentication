const express = require('express');
const filmModel = require('../models/film.model');
const validate = require('../middlewares/validate.mdw');
const SCHEMA = require('../schemas/film.json');

const router = express.Router();

module.exports = router;

router.get('/', async (req, res) => {
      const rows = await filmModel.findAll();
      res.json(rows);
})

router.get('/:id', async function (req, res) {
      const id = +req.params.id || 0;
      const film = await filmModel.findById(id);
      if (film === null) {
            return res.status(204).end();
      }
      res.json(film);
})

router.post('/', validate(SCHEMA.add), async function (req, res) {
      const film = req.body;
      // console.log(film.special_features);
      let merge_arr = film.special_features.toString();
      film.special_features = merge_arr;
      const result = await filmModel.add(film);

      film.film_id = result[0];
      res.status(201).json(film);
})

router.delete('/:id', async function (req, res) {
      const id = +req.params.id || 0;
      if (id === 0) {
            return res.json({
                  message: 'NO FILM DELETED.'
            })
      }

      const affected_rows = await filmModel.del(id);
      if (affected_rows === 0) {
            return res.json({
                  message: 'NO FILM DELETED.'
            })
      }

      res.json({
            message: 'FILM DELETED.'
      })
})

router.patch('/', validate(SCHEMA.update),async function (req, res) {
      const film = req.body;
      const id = film.film_id;
      delete film.film_id;
      const result = await filmModel.patch(id, film);
      res.json(result);
})