'use strict'

const { finById } = require("../services/apikey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden error'
            })
        }

        const objKey = await finById(key);
        // console.log({objKey});
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden error'
            })
        }
        req.objKey = objKey;
        return next();
    } catch (error) {
    }
}
const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permissions dined'
            })
        }
        // console.log(`permissions::`,req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission) {
            return res.status(403).json({
                message: 'Permissions dined'
            })
        }
        return next();
    }
}

module.exports = {
    apiKey,
    permission
}