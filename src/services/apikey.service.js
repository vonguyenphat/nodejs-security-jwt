'use strict'

const apiKeyModel = require("../models/apikey.model");

const finById = async(key)=>{
    const objKey = await apiKeyModel.findOne({key:key,status:true}).lean();
    return objKey;
}

module.exports = {
    finById
};