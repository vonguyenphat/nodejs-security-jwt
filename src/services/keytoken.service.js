'use strict'
const { Types } = require('mongoose');
const keyTokenModel = require("../models/keyToken.model");

// class KeyTokenService {
//     static createKeyToken = async ({ userId, publicKey }) => {
//         try {
//             const publicKeyString = publicKey.toString();
//             console.log(`publicKeyString::`,publicKeyString);
//             const tokens = await keyTokenModel.create({
//                 user:userId,
//                 publicKey:publicKeyString
//             })
//             return tokens ? tokens.publicKey : null;
//         } catch (error) {
//             return error;
//         }
//     }


// lv0

// class KeyTokenService {
//     static createKeyToken = async ({ userId, publicKey, privateKey }) => {
//         try {
//             const tokens = await keyTokenModel.create({
//                 user: userId,
//                 publicKey, 
//                 privateKey
//             })
//             return tokens ? tokens : null;
//         } catch (error) {
//             return error;
//         }
//     }
// }
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId }, update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken }, option = { upsert: true, new: true }
            const keyTokens = await keyTokenModel.findOneAndUpdate(filter, update, option);

            return keyTokens ? keyTokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }
    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
    }
    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: new Types.ObjectId(id) }).lean();
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken });
    }
    static deleteKeyByUserId = async (userId) => {
        return await keyTokenModel.deleteOne({ user: new Types.ObjectId(userId) }).lean();
    }
}
module.exports = KeyTokenService;