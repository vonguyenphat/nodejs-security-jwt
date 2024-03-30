'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const { createToKenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require('../utils/index');
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require("./shop.service");
const rolesShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};
class AccessService {
    /*
    1-check token used 
    */
    static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;
        console.log({ keyStore });
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await keyTokenService.deleteKeyByUserId(userId);
            throw new ForbiddenError('Something wrong happened !! Please re_login');
        }
        if (keyStore.refreshToken != refreshToken) {
            throw new AuthFailureError('Shop not registered');
        }

        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new AuthFailureError('Shop not registered');
        }


        const tokens = await createToKenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })
        return {
            metadata: {
                shop: getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: foundShop }),
                tokens
            }
        }
    }

    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id);
        return delKey;
    }

    /*
    1-check email
    2-match password
    3-create AT vs RT and save
    4-generate tokens
    5-get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError(`Shop not registered`);
        }
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailureError(`authentication error`);
        }
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        const { _id: userId } = foundShop;
        const tokens = await createToKenPair({ userId, email }, publicKey, privateKey);
        const keystore = await keyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
        })
        if (!keystore) {
            throw new BadRequestError(`Error: keystore error!`);
        }
        return {
            metadata: {
                shop: getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: foundShop }),
                tokens
            }
        }

    }


    static signUp = async ({ name, email, password }) => {
        // step1: check email exit?
        const holderShop = await shopModel.findOne({ email }).lean();

        if (holderShop) {
            throw new BadRequestError(`Error: Shop already registered!`);
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: rolesShop.SHOP
        })
        if (newShop) {

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            const { _id: userId } = newShop;
            const tokens = await createToKenPair({ userId, email }, publicKey, privateKey);
            const keystore = await keyTokenService.createKeyToken({
                userId,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            })
            if (!keystore) {
                throw new BadRequestError(`Error: keystore error!`);
            }
            return {
                metadata: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: newShop }),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }

    }
}
module.exports = AccessService;



//create privateKey,publicKey
// const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//         type: 'pkcs1', // publicKey cryptoGraphy standards
//         format: 'pem'
//     },
//     privateKeyEncoding: {
//         type: 'pkcs1',
//         format: 'pem'
//     }
// })

// console.log({ privateKey, publicKey }); // save collection Keystore

// const publicKeyString = await keyTokenService.createKeyToken({
//     userId: newShop._id,
//     publicKey,
// })

//     } catch (err) {
//         console.log(`error registered`,err);
//         return {
//             code: 'xxx',
//             massage: err.massage,
//             status: 'error'
//         }
//     }