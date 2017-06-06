const home = require('./home-controller')
const users = require('./users-controller')
const article = require('./article-controller')
const admin = require('./admin-controller')

module.exports = {
  home: home,
  users: users,
  article: article,
  admin: admin
}
