'use strict'


const AccessService = require("../services/access.service");
const {Create,SuccessResponse} = require("../core/success.response");

class AccessController {
    handleRefreshToken = async(req, res, next)=>{
        new SuccessResponse({
            message:'Get token success',
            metadata: await AccessService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

    logout = async (req, res, next) =>{
        new SuccessResponse({
            message:'Logout success',
            metadata:await AccessService.logout(req.keyStore)
        }).send(res);
    }
    login = async  (req, res, next) =>{
        console.log(`[P]::login::`, req.body);
        new SuccessResponse({
            message:'Login OK',
            metadata: await AccessService.login(req.body)
        }).send(res);
    }
    signUp = async (req, res, next) => {
            console.log(`[P]::signUp::`, req.body);
            new Create({
                message:'Registered OK!',
                metadata: await  AccessService.signUp(req.body)
            }).send(res)
    }
}
module.exports = new AccessController();


            // console.log(1);

            // t(req.body, AccessService.signUp)
            // console.log({ t });
            // const test = await AccessService.signUp(req.body);
            
            // console.log(3);