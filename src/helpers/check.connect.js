'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000;
// Check Number Connect to Database
const countConnect = () => {
    const numConnect = mongoose.connections.length;
    console.log(`Number of connections:: ${numConnect}`);
}

// check over load connect
const checkOverLoad = () => {
    setInterval(() => {
        const numConnect = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections = numCores * 5;

        console.log(`Active connections:: ${numConnect}`);
        console.log(`Memory usage:: ${memoryUsage/1024/1024}MB`);

        if(numConnect > maxConnections){
            console.log(`Connection overload detected!`);
            //notify.sent(...)
        }
    }, _SECONDS); // Monitor every 5 seconds
}
module.exports = {
    countConnect,
    checkOverLoad
}