require('dotenv').config();

function checkRole(req, res, next) {    
    if (res.locals.user.role == process.env.USER_ROLE) {
        res.sendStatus(401);
    } else {
        next();
    }
}

module.exports = { checkRole: checkRole }