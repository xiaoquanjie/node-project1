const mongo = require('../common/mongo')
const connection = require('./connection')

let commentDefinition = {
    id: {
        type: Number,
        unique: true
    },
    movieId: String,
    userName: String,
    content: String,
    check: Boolean
}

const info = connection.getInfo(connection.comment)

function getTable() {
    return mongo.model(info.type, info.collname, commentDefinition)
}

// 根据id查找评论
function findByMovieId(id) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            resolve(table.find({movieId: id, check: true}))
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

function findAll(filter = 0) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            let p = undefined
            if (filter === 0) {
                p = table.find({})
            }
            else if (filter === 1) {
                p = table.find({movieId: id, check: true})
            }
            else if (filter === 2) {
                p = table.find({movieId: id, check: false})
            }
            resolve(p)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

function insert(comment) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            let c = new table({
                id: comment.id,
                movieId: comment.movieId,
                userName: comment.userName,
                content: comment.content,
                check: true
            })
            resolve(c.save())
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

module.exports.getTable = getTable
module.exports.findByMovieId = findByMovieId
module.exports.findAll = findAll
module.exports.insert = insert