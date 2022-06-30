const express = require('express')
const userModel = require('../mongo-models/user')
const movieModel = require('../mongo-models/movie')
const mailModel = require('../mongo-models/mail')
const commentModel = require('../mongo-models/comment')
const counterModel = require('../mongo-models/counter')
const logger = require('../common/logger')
const crypto = require('crypto')

const initToken = 'TKL02o'
var router = express.Router()

router.post('/login', async function(req, res, next) {
    logger.info('try to login', req.body.userName)
    do {
        if (!req.body.userName) {
            res.json({status: 1, message: '用户名为空'})
            break
        }

        if (!req.body.password) {
            res.json({status: 1, message: '密码为空'})
            break
        }

        let user = await userModel.findByUserPassword(req.body.userName, req.body.password)
        if (!user) {
            res.json({status: 1, message: '密码错误'})
            break
        }

        if (user.userStop) {
            res.json({status: 1, message: '帐号被封'})
            break;
        }

        let token = getMd5Password(user.userName)
        res.cookie('token', token, { signed: true })
        res.json({status: 0, message: '登录成功', data: {token}})
        logger.info('login successfully', req.body.userName)
        return;
    } while (false)

    logger.warn('failed to login', req.body.userName)
})

router.post('/register', async function(req, res, next) {
    logger.info('try to regist user', req.body.userName)
    do {
        if (!req.body.userName) {
            res.json({status: 1, message: '用户名为空'})
            break
        }

        if (!req.body.password) {
            res.json({status: 1, message: '密码为空'})
            break
        }

        if (!req.body.userMail) {
            res.json({status: 1, message: '邮箱为空'})
            break
        }

        if (!req.body.userPhone) {
            res.json({status: 1, message: '手机为空'})
            break
        }

        try {
            let u = await userModel.insert({
                userName: req.body.userName,
                password: req.body.password,
                userMail: req.body.userMail,
                userPhone: req.body.userPhone
            })
            res.json({status: 0, message: '注册成功'})
            logger.info('regist user successfully', req.body.userName)
            return
        }
        catch(err) {
            res.json({status: 1, message: '用户已注册'})
        }
    } while (false)

    logger.warn('failed to regist user', req.body.userName)
})

router.post('/postComment', async (req, res, next)=> {
    do {
        if (!req.body.userName) {
            req.body.userName = '匿名用户'
        }  

        if (!req.body.movieId) {
            res.json({status: 1, message: '电影id为空'})
            break
        }

        if (!req.body.content) {
            logger.info('.....')
            res.json({status: 1, message: '评论内容为空'})
        }

        // 获取一条评论id
        let commentId = await counterModel.nextCommentId()
        if (commentId === 0) {
            res.json({status: 1, message: '评论id错误'})
            break
        }

        let c = await commentModel.insert({
            id: commentId,
            movieId: req.body.movieId,
            userName: req.body.userName,
            content: req.body.content
        })

        if (!c) {
            res.json({status: 1, message: '评论失败'})
        }
        else {
            res.json({status: 0, message: '评论成功'})
        }
    } while(false)
    
})

router.post('/support', async function(req, res, next) {
    logger.info('try to support movie', req.body.movieId)
    do {
        if (!req.body.movieId) {
            res.json({status: 1, message: '电影id为空'})
            break
        }

        let query = await movieModel.support(req.body.movieId)
        if (!query) {
            res.json({status: 1, message: '点赞失败'})
        }
        else {
            res.json({status: 0, message: '点赞成功'})
            return
        }
    } while (false)

    logger.info('failed to support movie', req.body.movieId)
})

router.post('/download', async (req, res)=> {
    logger.info('try to download movie', req.body.movieId)
    do {
        if (!req.body.movieId) {
            res.json({status: 1, message: '电影id为空'})
            break
        }

        let query = await movieModel.download(req.body.movieId)
        if (!query) {
            res.json({status: 1, message: '下载失败'})
        }
        else {
            res.json({status: 0, message: '下载成功', data: {url: query.movieMainPage}})
            return
        }
    } while (false)

    logger.info('failed to download movie', req.body.movieId)
})

router.post('/findPassword', async (req, res, next)=> {
    logger.info('try to find password', req.body.userName)
    do {
        if (!req.body.userName) {
            res.json({status: 1, message: '用户名为空'})
            break
        }

        if (!req.body.password) {
            res.json({status: 1, message: '旧密码为空'})
            break
        }

        if (!req.body.rePassword) {
            res.json({status: 1, message: '新密码为空'})
            break
        }

        let user = await userModel.findByUserPassword(req.body.userName, req.body.password)
        if (!user) {
            res.json({status: 1, message: '旧密码错误'})
            break
        }

        let query = await userModel.updatePassword(req.body.userName, req.body.rePassword)
        if (query.modifiedCount !== 1) {
            res.json({status: 1, message: '更新密码错误'})
            break
        }

        res.json({status: 0, message: '更新密码成功'})
        logger.info('user findPassword successfully', req.body.userName)
        return
    } while (false)

    logger.warn('failed to find password', req.body.userName)
})

router.post('/sendEmial', async function(req, res, next) {
    logger.info('try to send mail')
    do {
        if (!req.body.fromUser) {
            res.json({status: 1, message: '发送人为空'})
            break
        }
        if (!req.body.toUser) {
            res.json({status: 1, message: '接收人为空'})
            break
        }
        if (!req.body.title) {
            res.json({status: 1, message: '标题为空'})
            break
        }
        if (!req.body.content) {
            res.json({status: 1, message: '内容为空'})
            break
        }

        let fromUser = await userModel.findByUserName(req.body.fromUser)
        if (!fromUser) {
            res.json({status: 1, message: '发送人不存在'})
            break
        }

        let toUser = await userModel.findByUserName(req.body.toUser)
        if (!toUser) {
            res.json({status: 1, message: '接受人不存在'})
            break
        }

        let mailId = await counterModel.nextMailId()
        if (mailId === 0) {
            res.json({status: 1, message: '邮件id错误'})
            break
        }

        let query = mailModel.insert({
            id: mailId,
            fromUser: req.body.fromUser,
            toUser: req.body.toUser,
            title: req.body.title,
            content: req.body.content
        })

        if (!query) {
            res.json({status: 1, message: '发送邮件失败'})
            break
        }

        res.json({status: 0, message: '发送邮件成功'})
        return
    } while(false)

    logger.info('failed to send mail', req.body)
})

router.post('/showEmail', async (req, res)=> {
    do {
        if (!req.body.userName) {
            res.json({status: 1, message: '用户为空'})
            break
        }
        if (req.body.receive !== 1
            && req.body.receive !== 2
            && req.body.receive !== 3) {
            res.json({status: 1, message: '显示状态错误'})
            break
        }

        // 权限
        // if (req.signedCookies.token === getMd5Password(req.body.userName)) {
        //     res.json({status: 1, message: '权限不足'})
        //     break
        // }

        let query = undefined
        if (req.body.receive === 1) {
            query = await mailModel.findAll(req.body.userName)
        }
        else if (req.body.receive === 2) {
            query = await mailModel.findByFromUser(req.body.userName)
        }
        else if (req.body.receive === 3) {
            query = await mailModel.findByToUser(req.body.userName)
        }

        if (!query) {
            res.json({status: 1, message: '获取邮件失败'})
            break
        }

        res.json({status: 0, message: '获取邮件成功', data: query})
        return
    } while (false)
})

function getMd5Password(id) {
    let md5 = crypto.createHash('md5')
    let tokenBefore = id + initToken
    return md5.update(tokenBefore).digest('hex')
}

module.exports = router