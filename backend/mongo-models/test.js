const mongo = require('../common/mongo')
const connection = require('./connection')
const userModel = require('./user')
const counterModel = require('./counter')
const commentModel = require('./comment')
const { expect } = require('chai')

function connTest(value) {
    it(value.collname + ' connection?', function (done) {
        mongo.getConnection(value.type)
        .then(function(table) {
            done()
        })
        .catch(function(err) {
            throw err
        })
    })
}

function tableTest(value) {
    it(value.collname + ' table?', function(done) {
        if (value.collname === 'user') {
            let t = undefined
            let u = undefined
            userModel.getTable()
            .then(function(table) {
                t = table
                u = new table({
                    userName: 'jack___test',
                    password: '#$234fdsfsf',
                    userMail: '.....',
                    userPhone: '1233'
                })
                return u.save()
            })
            .then(function(resUser) {
                done()
            })
            .catch(function(err) {
                throw err
            })
        }

        if (value.collname === 'counter') {
            counterModel.nextValue('commentId')
            .then(function(seq) {
                done()
            })
            .catch(function(err) {
                throw err
            })
        }

        if (value.collname === 'comment') {
            counterModel.nextValue('commentId')
            .then(function(seq) {
                return commentModel.insert({
                    id: seq,
                    movieId: 'abc123',
                    userName: 'jack',
                    content: 'this is very goods'
                })
            })
            .then(function() {
                done()
            })
            .catch(function(err) {
                throw err
            })
        }
    })
}

describe('models', function() {
    describe('main', function() {
        this.timeout(5000)
        for (value of connection.connInfos) {
            connTest(value)
            tableTest(value)
        }
    })
})
