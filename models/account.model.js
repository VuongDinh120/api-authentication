const db = require('../utils/db');

module.exports = {
    findAll() {
        return db('account');
    },
    async findById(id) {
        const rows = await db('account').where('account_id', id);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    },
    async findByCredentials({username, password}) {
        // Search for a user by email and password.
        const row = await db('account')
            .where('username', username)
            .andWhere('password', password);
        const account = row[0];
        if (account) {
            const { password, ...accountWithoutPassword } = account;
            return accountWithoutPassword;
        }
    },
    add(account) {
        return db('account').insert(account);
    },
    del(id) {
        return db('account')
            .where('account_id', id).del();
    },
    patch(id, account) {
        return db('account')
            .where('account_id', id).update(account);
    }
}