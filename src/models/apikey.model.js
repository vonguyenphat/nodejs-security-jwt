'use strict'

const { Schema, model } = require('mongoose'); 
const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys'

const apiKeySchema = new Schema({
    key: {
        type: String,
        require:true,
        unique:true
    },
    status:{
        type:Boolean,
        default:true
    },
    permissions:{
        type:[String],
        require:true,
        enum:['0000','1111','2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
}
);
//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);