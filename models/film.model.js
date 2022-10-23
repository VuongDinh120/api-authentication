const db = require('../utils/db');

module.exports = {
    findAll(){
        return db('film');
    },
    async findById(id){
        const rows = await db('film').where('film_id',id); 
        if(rows.length ===0){
            return null;
        }
        return rows[0];
    },
    add(film){
        return db('film').insert(film);
    },
    del(id){
        return db('film')
        .where('film_id',id).del();
    },
    patch(id, film){
        return db('film')
        .where('film_id',id).update(film);
    }
}