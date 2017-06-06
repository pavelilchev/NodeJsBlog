const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', auth.isAuthenticated, controllers.users.logout)

  app.get('/article/add', auth.isAuthenticated, controllers.article.addGet)
  app.post('/article/add', auth.isAuthenticated, controllers.article.addPost)
  app.get('/article/list', controllers.article.allGet)
  app.get('/article/details/:id', auth.isAuthenticated, controllers.article.detailsGet)
  app.get('/article/edit/:id', auth.isAuthenticated, controllers.article.editGet)
  app.post('/article/edit/:id', auth.isAuthenticated, controllers.article.editPost)

  app.get('/admin/list', auth.isInRole('Admin'), controllers.admin.listGet)
  app.get('/admin/delete/:id', auth.isInRole('Admin'), controllers.admin.deleteGet)
  app.post('/admin/delete/:id', auth.isInRole('Admin'), controllers.admin.deletePost)

  app.all('*', (req, res) => {
    res.status(404)
    res.render('layouts/error')
  })
}
