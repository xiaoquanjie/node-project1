/**
 * mongo自动增长表
 */

const mongo = require('../common/mongo')
const connection = require('./connection')

let counterDefinition = {
    _id: String,
    sequence_value: Number
}

const info = connection.getInfo(connection.counter)

function getTable() {
    return mongo.model(info.type, info.collname, counterDefinition)
}

function getNextSequenceValue(sequenceName) {
    return new Promise((resolve, reject)=> {
        getTable()
        .then((table)=> {
            return table.findOneAndUpdate({
                _id: sequenceName
            }, {
                $inc: {sequence_value: 1}
            }, {
                new: true,
                upsert: true
            })
        })
        .then((doc)=> {
            resolve(doc.sequence_value)
        })
        .catch((err)=> {
            reject(err)
        })
    })
} 

module.exports.getTable = getTable
module.exports.nextValue = getNextSequenceValue
module.exports.nextCommentId = function() {
    return getNextSequenceValue('commentId')
}
module.exports.nextMailId = function() {
    return getNextSequenceValue('mailId')
}