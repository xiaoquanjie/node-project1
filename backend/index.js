const logger = require('./common/logger')
const express = require('express')
const security = require('./common/security')
const cors = require('cors')
const userRouter = require('./routes/users')

logger.configure({})
let app = express()

app.set('port', 80)

app.use(security({}, {}, 'secret|12323@432'))
app.use(cors())
app.use(logger())

// app.use('/', function(req, res, next) {
//     next()
//     return
//     if (req.url !== '/user/login' && req.url !== '/user/register') {
//         if (!req.signedCookies.token) {
//             res.json({status: 1, message: '需要先登录'})
//             return
//         }
//         else {
//             next()
//         }
//     }
//     else {
//         next()
//     }
// })

app.use('/user', userRouter)

app.get('/about', function(req, res) {
    res.type('text/plain')
    res.end('about')
})

app.use((req, res)=> {
    res.type('text/plain')
    res.end('invalid url:' + req.url)
})

app.use(function(err, req, res, next) {
    console.log('error...')
    res.type('text/plain')
    res.end('system error')
})

app.listen(app.get('port'), function() {
    logger.info('http server start')
})

// function test() {
//     return new Promise((resolve, reject)=> {
//         reject('fdsf')
//     })
// }

// async function test2() {
//     await test()
//     console.log('....')
// }

// test2()