const Article = require('../data/Article')
const articlePerPage = 4

module.exports = {
  addGet: (req, res) => {
    res.render('article/add')
  },
  addPost: (req, res) => {
    let articleReq = req.body

    let article = {
      title: articleReq.title,
      description: articleReq.description,
      author: req.user._id
    }

    Article.create(article)
      .then(article => {
        res.redirect('/?success=Article added!')
      })
      .catch((error) => {
        article.error = error
        res.render('article/add', article)
      })
  },
  allGet: (req, res) => {
    let query = req.query
    let sort = {}
    let queryString = {}
    if (query.sort) {
      sort.date = query.sort
      queryString.sort = query.sort
    }

    let pageNumber = 1
    if (query.page) {
      pageNumber = query.page
    }

    queryString.page = pageNumber
    Article.find({}).populate('author', 'username').sort(sort).exec(function (err, articles) {
      if (err) {
        console.log(err)
        return
      }

      let data = {}
      if (articles.length === 0) {
        data.success = 'No Articles found!'
      }

      let arts = []
      for (let a of articles) {
        let article = {
          title: a.title,
          description: buildContentPreview(a.description, 150),
          date: a.date.toLocaleDateString(),
          author: a.author,
          showDetails: res.locals.currentUser != null,
          _id: a._id
        }

        arts.push(article)
      }

      if (arts.length < pageNumber * articlePerPage - articlePerPage) {
        res.render('404 Not Found!')
        return
      }

      if (arts.length > articlePerPage) {
        let total = Math.ceil(arts.length / articlePerPage)
        let totalPages = []
        for (let i = 1; i <= total; i++) {
          totalPages.push(i)
        }
        data.totalPages = totalPages
      }

      arts = arts.splice((pageNumber - 1) * articlePerPage, articlePerPage)
      data.articles = arts
      data.queryString = queryString

      res.render('article/list', data)
    })
  },
  detailsGet: (req, res) => {
    let id = req.params.id
    let queryData = req.query

    let data = {}
    if (req.query.error) {
      data.error = req.query.error
    } else if (req.query.success) {
      data.success = req.query.success
    }

    Article.findById(id).populate('author').then(article => {
      if (!article) {
        res.render('404 Not Found')
        return
      }

      if (res.locals.currentUser) {
        article.canEdit = res.locals.currentUser.id === article.author.id
      }

      data.article = article
      res.render('article/details', data)
    })
  },
  editGet: (req, res) => {
    let id = req.params.id
    Article.findById(id).populate('author').then(article => {
      if (!article) {
        res.render('404 Not Found')
        return
      }

      res.render('article/edit', article)
    })
  },
  editPost: (req, res) => {
    let id = req.params.id
    let edited = req.body
    Article.findById(id).populate('author').then(article => {
      if (!article) {
        res.render('404 Not Found')
        return
      }

      article.title = edited.title
      article.description = edited.description

      article.save().then(article => {
        res.redirect(`/article/details/${id}?success=Article saved!`)
      })
    })
  }
}

function buildContentPreview(text, maxLength) {
  var trimmedString = text.substr(0, maxLength)
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')))
  if (text.length > maxLength) {
    trimmedString += '...'
  }

  return trimmedString
}
