const mongo = require('../common/mongo')
const connection = require('./connection')

let userDefinition = {
    userName: { // 索引
        type: String,
        unique: true    
    },
    password: String,
    userMail: String,
    userPhone: String,
    userAdmin: Boolean,
    userPower: Number,
    userStop: Boolean,
}

const info = connection.getInfo(connection.user)

function getTable() {
    return mongo.model(info.type, info.collname, userDefinition)
}

// 返回所有的文档，或者抛出异常
function findAll() {
    return new Promise(function(resolve, reject) {
        getTable()
        .then((table)=> {
            table.find({})
            .then((docs)=> {
                resolve(docs)
            })
            .catch((err)=> {
                reject(err)
            })
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

// 根据用户名字进行查找
function findByUserName(name) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            return table.findOne({userName: name})
        })
        .then((docs)=> {
            resolve(docs)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

// 登录匹配, 返回文档, 找不到返回null
function findByUserPassword(name, password) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            resolve(table.findOne({userName: name, password: password}))
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

// 验证邮箱，电话和用户名找到用户
function findByNMP(name, mail, phone) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            resolve(table.findOne({userName: name, userMail: mail, userPhone: phone}))
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

function insert(user) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            let u = new table({
                userName: user.userName,
                password: user.password,
                userMail: user.userMail,
                userPhone: user.userPhone,
                userAdmin: false,
                userPower: 0,
                userStop: false
            })
            resolve(u.save())
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

function updatePassword(user, password) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            resolve(table.updateOne({userName: user}, {password: password}))
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

module.exports.getTable = getTable
module.exports.findAll = findAll
module.exports.findByUserName = findByUserName
module.exports.findByUserPassword = findByUserPassword
module.exports.findByNMP = findByNMP
module.exports.insert = insert
module.exports.updatePassword = updatePassword