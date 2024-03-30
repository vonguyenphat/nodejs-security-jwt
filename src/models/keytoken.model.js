'use strict'
const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys'

// model chứa key store => chứa keypuclic mỗi user
const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        require: true
    },
    privateKey: {
        type: String,
        require: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME

}
);
//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);