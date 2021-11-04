"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = void 0;
const admin = true;
const checkAdmin = (req, res, next) => {
    console.log('EJECUTANDO MIDDLEWARE');
    if (admin)
        next();
    else {
        res.status(401).json({
            msg: 'No estas autorizado',
        });
    }
};
exports.checkAdmin = checkAdmin;
