const Article = require('../data/Article')

module.exports = {
    listGet: (req, res) => {
        let queryData = req.query

        let data = {}
        if (req.query.error) {
            data.error = req.query.error
        } else if (req.query.success) {
            data.success = req.query.success
        }

        Article.find({}).populate('author', 'username').exec((err, articles) => {
            if (err) {
                res.render('layouts/error')
                return
            }

            data.articles = articles
            res.render('admin/list', data)
        })
    },
    deleteGet: (req, res) => {
        let id = req.params.id
        Article.findById(id).then(article => {
            if (!article) {
                res.render('layouts/error')
                return
            }

            res.render('admin/delete', article)
        })
    },
    deletePost: (req, res) => {
        let id = req.params.id
        Article.findByIdAndRemove({ _id: id }).then(article => {
            res.redirect('/admin/list?success=Article deleted!')
        })
    }
}