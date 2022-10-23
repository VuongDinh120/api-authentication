const db = require('../utils/db');

module.exports = {
    findAll(){
        return db('actor');
    },
    add(actor){
        return db('actor').insert(actor);
    },
}