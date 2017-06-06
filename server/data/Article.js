const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let articleShcema = new mongoose.Schema({
  title: {type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE},
  description: {type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE},
  date: {type: mongoose.Schema.Types.Date, default: Date.now},
  author: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
})

let Article = mongoose.model('Article', articleShcema)

module.exports = Article
