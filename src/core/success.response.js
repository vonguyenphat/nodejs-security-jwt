'use strict'
const reasonPhrases = require("../utils/reasonPhrases")
const statusCodes = require("../utils/statusCodes")
class SuccessResponse {
    constructor({ message, statusCode = statusCodes.OK, reasonStatusCode = reasonPhrases.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        console.log(this);
        return res.status(this.status).json(this);
    }
}
class Ok extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}
class Create extends SuccessResponse {
    constructor({ message, statusCode = statusCodes.CREATED, reasonStatusCode = reasonPhrases.CREATED, metadata = {} }) {
        super({ message, statusCode, reasonStatusCode, metadata });
    }

}

module.exports = {
    SuccessResponse,
    Ok,
    Create
}
