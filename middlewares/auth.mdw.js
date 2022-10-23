const md5 = require('md5');

const accountModel = require('../models/account.model')


const basicAuth = async (req, res, next) => {

    // make authenticate path public
    if (req.path === '/api/auth/login') {
        return next();
    }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    try {
        const account = await accountModel.findByCredentials({ username, password })
        if (!account) {
            return res.status(401).json({ message: 'Invalid Authentication Credentials' });
        }
        req.account = account;
        next()
    } catch (error) {
        res.status(401).json({ message: 'Not authorized to access this resource' });
    }
}


function checkValidTime(present_time, req_time) {
    const sec = (present_time - req_time) / 1000;
    return (sec >= 0 && sec <= 60)
}

const secretKeyAuth = async (req, res, next) => {

    // make authenticate path public
    if (req.path === '/api/auth/login') {
        return next();
    }

    // check for token bearer auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const token = req.headers.authorization.split(' ')[1];
    const decode_str = Buffer.from(token, 'base64').toString('ascii');

    //split decode_str = req_time '+' secret_str
    const secret_arr = decode_str.split("+");
    const secret_str = secret_arr[1];
    // const req_time = secret_arr[0];
    // const present_time = new Date().getTime();

    const req_time = 1665862569017;//test time
    const present_time = 1665862569018;//test time

    //check token time is valid
    if (!checkValidTime(present_time, req_time)) {
        return res.status(401).json({ message: 'This token has been timeout!!' });
    }

    //encode secret key
    const encode_key = Buffer.from(process.env.SECRET_KEY).toString('base64');

    //get hash string
    const hash_str = md5(`${req.url}${req_time}${encode_key}`);

    //Check secret string
    if (secret_str !== hash_str) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    next()
}

// module.exports = basicAuth
module.exports = secretKeyAuth
