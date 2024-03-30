'use strict'
const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESH_TOKEN: 'x-rtoken-id'
}
const URL = {
    REFRESH_TOKEN_URL: '/v1/api/shop/refresh-token'
}

const createToKenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '7 days'
        });
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '20 days'
        });
        return { accessToken, refreshToken }
    } catch (error) {
        return error;
    }
}
/*
1-check userId missing ??
2-get accessToken
3-verify token
4-check user in db
5-check keystore with this userId
6-Ok -> return next
*/
const authentication = asyncHandler(
    async (req, res, next) => {
        const userId = req.headers[HEADER.CLIENT_ID];
        if (!userId) throw new AuthFailureError('Invalid Request');

        const keyStore = await findByUserId(userId);

        if (!keyStore) throw new NotFoundError('Not found keystore 1');

        const accessToken = req.headers[HEADER.AUTHORIZATION];
        if (!accessToken) throw new AuthFailureError('Invalid Request');

        try {
            // const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
            const decodeUser = await verifyJWT(accessToken, keyStore.publicKey);
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User');
            req.keyStore = keyStore;
            return next();
        } catch (error) {
            throw new AuthFailureError(error);
        }
    }
)

const authenticationV2 = asyncHandler(
    async (req, res, next) => {
        const userId = req.headers[HEADER.CLIENT_ID];
        if (!userId) throw new AuthFailureError('Invalid Request 1');

        const keyStore = await findByUserId(userId);
        if (!keyStore) throw new NotFoundError('Not found keystore');

        // console.log(req.originalUrl);
        if (req.originalUrl == URL.REFRESH_TOKEN_URL) {
            if (req.headers[HEADER.REFRESH_TOKEN]) {
                try {
                    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
                    const decodeUserByRT = await verifyJWT(refreshToken, keyStore.privateKey);
                    if (userId !== decodeUserByRT.userId) throw new AuthFailureError('Invalid User');
                    req.keyStore = keyStore;
                    req.user = decodeUserByRT;
                    req.refreshToken = refreshToken;
                    return next();
                } catch (error) {
                    throw new AuthFailureError(error);
                }
            }
        }


        const accessToken = req.headers[HEADER.AUTHORIZATION];
        if (!accessToken) throw new AuthFailureError('Invalid Request 2');
        try {
            // const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
            const decodeUser = await verifyJWT(accessToken, keyStore.publicKey);
            console.log(decodeUser);
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User');
            req.keyStore = keyStore;
            return next();
        } catch (error) {
            throw new AuthFailureError(error);
        }
    }
)

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
}
-
module.exports = {
    createToKenPair,
    authentication,
    verifyJWT,
    authenticationV2
}