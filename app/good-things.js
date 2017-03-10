const dateUtil = appRequire('date')
const GoodThing = appRequire('model/good-thing.js')

module.exports = {
  day,
  update,
  fetchDay,
  history
}

//  route handlers

function day (req, res, _next) {
  var date = dateUtil.extract(req.params.date)
  getGoodThings(req.user, date, res)
}

function update (req, res, _next) {
  saveGoodThing(req.user, req, res)
}

function history (req, res, _next) {
  fetchHistory(req.user).then(function (goodThings) {
    res.json({err: null, goodThings: goodThings})
  }).catch(function (err) {
    res.json({err: err, goodThings: []})
  })
}

//  other exports

function fetchDay (user, date) {
  return GoodThing.find({
    user: user,
    day: date
  }).sort('created_at').exec()
}

//  private helpers

function getGoodThings (user, date, res) {
  fetchDay(user, date).then(function (goodThings) {
    res.json({err: null, goodThings: goodThings})
  }).catch(function (err) {
    res.json({err: err, goodThings: []})
  })
}

function fetchHistory (user, limit = 100) {
  return GoodThing.find({user: user})
    .sort({day: -1, created_at: 1})
    .limit(limit)
    .exec()
}

function saveGoodThing (user, req, res) {
  var params = extractGoodThingParams(user, req)
  var save = params.id
    ? updateGoodThing(params)
    : newGoodThing(params)
  save.then(function (goodThing) {
    res.status(params.id ? 200 : 201)
      .json({err: null, goodThing: goodThing})
  }).catch(function (err) {
    res.status(500).json({err: err, goodThing: null})
  })
}
function extractGoodThingParams (user, req) {
  var params = {
    user: user.id,
    day: dateUtil.extract(req.body.day),
    title: req.body.title,
    details: req.body.details
  }
  if (req.body.id) {
    params.id = req.body.id
  }
  return params
}
function newGoodThing (params) {
  var goodThing = new GoodThing(params)
  return goodThing.save()
}
function updateGoodThing (params) {
  var query = GoodThing.findOne({ _id: params.id, user: params.user })
  return query.then(function (goodThing) {
    goodThing.title = params.title
    goodThing.details = params.details
    return goodThing.save()
  })
}
