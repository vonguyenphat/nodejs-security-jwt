'use strict'
const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication, authenticationV2 } = require('../../auth/authUtils');
// signup
router.post('/shop/signup', asyncHandler(AccessController.signUp));
router.post('/shop/login', asyncHandler(AccessController.login));

// authentication
router.use(authenticationV2)

router.get('/shop/test', (req, res, next) => {
    res.status(200).json({
        message:'Test',
        metadata:'Vo Nguyen Phat'
    })
})
router.post('/shop/logout', asyncHandler(AccessController.logout));
router.post('/shop/refresh-token', asyncHandler(AccessController.handleRefreshToken))
module.exports = router;