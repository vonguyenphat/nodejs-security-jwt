'use strict'
const mongoose = require('mongoose')

const { db: { host, port, name } } = require('../configs/config.mongodb')
// console.log({ host, port, name });
const connectString = `mongodb://0.0.0.0:${port}/${name}`
// const connectString = `mongodb://0.0.0.0:27017/shopDev`
const { countConnect } = require('../helpers/check.connect');
class Database {
    constructor() {
        this.connect()
    }
    connect(type = 'mongodb') {
        if (1 == 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectString)
            .then(_ => {
                console.log(`connect mongodb success:: ${name}`);
                countConnect();
            })
            .catch(err => console.log(`Error connect mongodb!! ${err}`));
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;