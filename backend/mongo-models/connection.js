const mongo = require('../common/mongo')

const connType = {
    counter: 0,
    user: 1,
    mail: 2,
    movie: 3,
    comment: 4
}

const connInfos = [
    {type: 0, uri: 'mongodb://192.168.0.31:27017', collname: 'counter', opts: {dbName: 'test3', autoIndex: true}},
    {type: 1, uri: 'mongodb://192.168.0.31:27017', collname: 'user', opts: {dbName: 'test3', autoIndex: true}},
    {type: 2, uri: 'mongodb://192.168.0.31:27017', collname: 'mail', opts: {dbName: 'test3', autoIndex: true}},
    {type: 3, uri: 'mongodb://192.168.0.31:27017', collname: 'movie', opts: {dbName: 'test3', autoIndex: true}},
    {type: 4, uri: 'mongodb://192.168.0.31:27017', collname: 'comment', opts: {dbName: 'test3', autoIndex: true}},
]

// 设置链接
for (value of connInfos) {
    mongo.setConnectionOpts(value.type, value.uri, value.opts)
}

module.exports = connType
module.exports.connInfos = connInfos
module.exports.getInfo = function(type) {
    for (value of connInfos) {
        if (value.type == type) {
            return value
        }
    }

    return undefined
}

 
