const mongo = require('../common/mongo')
const connection = require('./connection')

let mailDefinition = {
    id: {
        type: Number,
        unique: true
    },
    fromUser: String,
    toUser: String,
    title: String,
    content: String
}

const info = connection.getInfo(connection.mail)

function getTable() {
    return mongo.model(info.type, info.collname, mailDefinition)
}

function findByToUser(toUser) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            resolve(table.find({ toUser }))
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

function findByFromUser(fromUser) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            resolve(table.find({ fromUser }))
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

function findAll(userName) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            resolve(table.find({
                "$or": [
                    {fromUser: userName},
                    {toUser: userName}
                ]
            }))
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

function insert(mail) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            let c = new table({
                id: mail.id,
                fromUser: mail.fromUser,
                toUser: mail.toUser,
                title: mail.title,
                content: mail.content
            })
            resolve(c.save())
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

module.exports.getTable = getTable
module.exports.findByToUser = findByToUser
module.exports.findByFromUser = findByFromUser
module.exports.findAll = findAll
module.exports.insert = insert