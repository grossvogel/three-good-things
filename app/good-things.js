const dateUtil = appRequire('date');
const GoodThing = appRequire('model/good-thing.js');

module.exports.day = function(req, res, _next) {
  var date = dateUtil.extract(req.params.date);
  getGoodThings(req.user, date, res);
};

module.exports.update = function(req, res, _next) {
  saveGoodThing(req.user, req, res);
};

module.exports.fetchDay = function(user, date) {
  return dayQuery(user, date);
};

function getGoodThings(user, date, res) {
  dayQuery(user, date).then(function(goodThings) {
    res.json({ err: null, goodThings: goodThings});
  }).catch(function (err) {
    res.json({ err: err, goodThings: [] });
  });
}
function dayQuery(user, date) {
  return GoodThing.find({
    user: user,
    day: date
  }).sort('created_at').exec();
}

function saveGoodThing(user, req, res) {
  var params = extractGoodThingParams(user, req);
  var save = params.id
    ? updateGoodThing(params)
    : newGoodThing(params);
  save.then(function(goodThing) {
    res.json({err: null, goodThing: goodThing});
  }).catch(function(err) {
    res.json({err: err, goodThing: null});
  });
}
function extractGoodThingParams(user, req) {
  var params = {
    user: user.id,
    day: dateUtil.extract(req.body.day),
    title: req.body.title,
    details: req.body.details
  };
  if(req.body.id) {
    params.id = req.body.id;
  }
  return params;
}
function newGoodThing(params) {
  var goodThing = new GoodThing(params);
  return goodThing.save();
}
function updateGoodThing(params) {
  var query = GoodThing.findOne({ _id: params.id, user: params.user })
  return query.then(function(goodThing) {
    goodThing.title = params.title;
    goodThing.details = params.details;
    return goodThing.save();
  });
}
