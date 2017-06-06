module.exports = {
  index: (req, res) => {
    let queryData = req.query

    let data = {}
    if (req.query.error) {
      data.error = req.query.error
    } else if (req.query.success) {
      data.success = req.query.success
    }

    res.render('home/index', data)
  }
}
