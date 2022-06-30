const mongo = require('../common/mongo')
const connection = require('./connection')

let movieDefinition = {
    id: {
        type: String,
        unique: true
    },
    movieName: String,
    movieImg: String,
    movieVideo: String,
    movieDownload: Boolean,
    movieTime: Date,
    movieNumSuppose: Number,    // 点赞次数
    movieNumDownload: Number,   // 下载次数
    movieMainPage: String
}

const info = connection.getInfo(connection.movie)

function getTable() {
    return mongo.model(info.type, info.collname, movieDefinition)
}

function support(movieId) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            let q = table.findOneAndUpdate({
                id: movieId
            }, {
                $inc: {movieNumSuppose: 1}
            }, {
                new: true,
                upsert: false
            })
            resolve(q)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

function download(movieId) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            let q = table.findOneAndUpdate({
                id: movieId
            }, {
                $inc: {movieNumDownload: 1}
            }, {
                new: true,
                upsert: false
            })
            resolve(q)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

module.exports.getTable = getTable
module.exports.support = support
module.exports.download = download