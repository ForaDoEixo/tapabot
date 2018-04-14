'use strict'

/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const utils = require('../src/utils')

describe('main functions', function () {
  describe('inlineRowsKeyboard', function () {
    let defaultKeys

    before(() => {
      defaultKeys = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
    })

    it('empty keys() should throw', function () {
      expect(utils.inlineRowsKeyboard([])).to.throw()
    })

    it('2 keys make a 1 row keyboard', function () {
      let keyboard = utils.inlineRowsKeyboard(defaultKeys.slice(0, 2))

      expect(keyboard).to.be.an('object')
      expect(keyboard.reply_markup).to.be.an('object')
      expect(keyboard.reply_markup.inline_keyboard).to.be.an('array')
      expect(keyboard.reply_markup.inline_keyboard.length).to.equal(1)
      expect(keyboard.reply_markup.inline_keyboard[0].length).to.equal(2)
      expect(keyboard.reply_markup.inline_keyboard[0][0].text).to.equal('zero')
    })

    it('4 keys make a 2 row keyboard', function () {
      let keyboard = utils.inlineRowsKeyboard(defaultKeys.slice(0, 4))

      expect(keyboard.reply_markup.inline_keyboard).to.be.an('array')
      expect(keyboard.reply_markup.inline_keyboard.length).to.equal(2)
    })

    it('default row size is 3', function () {
      let keyboard = utils.inlineRowsKeyboard(defaultKeys.slice(0, 4))

      expect(keyboard.reply_markup.inline_keyboard.length).to.equal(2)
      expect(keyboard.reply_markup.inline_keyboard[0].length).to.equal(3)
      expect(keyboard.reply_markup.inline_keyboard[1].length).to.equal(1)
      expect(keyboard.reply_markup.inline_keyboard[0][0].text).to.equal('zero')
      expect(keyboard.reply_markup.inline_keyboard[1][0].text).to.equal('three')
    })

    it('6 keys with 2 rows', function () {
      let keyboard = utils.inlineRowsKeyboard(defaultKeys.slice(0, 6), 2)

      expect(keyboard.reply_markup.inline_keyboard.length).to.equal(3)
      expect(keyboard.reply_markup.inline_keyboard[0].length).to.equal(2)
      expect(keyboard.reply_markup.inline_keyboard[1].length).to.equal(2)
      expect(keyboard.reply_markup.inline_keyboard[2].length).to.equal(2)

      expect(keyboard.reply_markup.inline_keyboard[0][0].text).to.equal('zero')
      expect(keyboard.reply_markup.inline_keyboard[1][0].text).to.equal('two')
      expect(keyboard.reply_markup.inline_keyboard[1][0].text).to.equal('four')
    })

    it('default transform is (k) => (k)', function () {
      let keyboard = utils.inlineRowsKeyboard(defaultKeys.slice(0, 2))

      expect(keyboard.reply_markup.inline_keyboard[0][0].text).to.equal('zero')
      expect(keyboard.reply_markup.inline_keyboard[0][0].callback_data).to.equal('zero')
    })

    it('transform is called', function () {
      let transform = function (k) { throw new Error('transform called') }
      expect(utils.inlineRowsKeyboard(defaultKeys.slice(0, 2), transform = transform)).to.throw()
    })

    it('transform is applied', function () {
      let transform = (k) => (`got ${k}`)
      let keyboard = utils.inlineRowsKeyboard(defaultKeys.slice(0, 6), transform = transform)

      console.error(keyboard.reply_markup.inline_keyboard)

      expect(keyboard.reply_markup.inline_keyboard[0][0].text).to.equal('zero')
      expect(keyboard.reply_markup.inline_keyboard[0][0].callback_data).to.equal('got zero')
    })
  })

  describe('debugPromise', function () {
    it('should return the same value when called in a then', function (done) {
      Promise.resolve('hello')
        .then(utils.debugPromise('test'))
        .then(v => expect(v).to.equal('hello'))
        .then(v => done())
    })
  })

  describe('getProviders', function () {
    it('should return the list of providers, as an object', function (done) {
      utils.getProviders().then((providers) => {
        let keys = Object.keys(providers)

        expect(utils.getProviders()).to.be.an('object')
        expect(keys).to.be.an('array')
        expect(keys.length).to.equal(2)

        done()
      })
    })

    it('should map keys to provider names', function (done) {
      utils.getProviders().then((providers) => {
        let keys = Object.keys(providers)

        expect(utils.getProviders()[keys[0]].name).to.equal(keys[0])

        done()
      })
    })
  })

  describe('objectify', function () {
    it('should transform an array of objects into a named hash', function () {
      let ret = utils.objectify([{name: 'one'}, {name: 'two'}, {name: 'three'}])
      expect(ret).to.deep.equal({
        one: {name: 'one'},
        two: {name: 'two'},
        three: {name: 'three'}
      })
    })

    it('should merge similar object', function () {
      let ret = utils.objectify([{name: 'one', value: 'one'},
        {name: 'two', value: 'two'},
        {name: 'two', value: 'dos'}])
      expect(ret).to.deep.equal({
        one: {name: 'one', value: 'one'},
        two: {name: 'two', value: 'dos'}
      })
    })

    it('should merge similar object deeply', function () {
      let ret = utils.objectify([{name: 'one', deep: {value: 'one', pt: 'un'}},
        {name: 'two', deep: {value: 'two', pt: 'dois'}},
        {name: 'two', deep: {value: 'dos'}}])
      expect(ret).to.deep.equal({
        one: {name: 'one', deep: {value: 'one', pt: 'un'}},
        two: {name: 'two', deep: {value: 'dos', pt: 'dois'}}
      })
    })

    it('should merge similar object shalowly', function () {
      let ret = utils.objectify([{name: 'one', deep: {value: 'one', pt: 'un'}},
        {name: 'two', deep: {value: 'two', pt: 'dois'}},
        {name: 'two', deep: {value: 'dos'}}],
      Object.assign
      )
      expect(ret).to.deep.equal({
        one: {name: 'one', deep: {value: 'one', pt: 'un'}},
        two: {name: 'two', deep: {value: 'dos'}}
      })
    })
  })
})
