const React = require('react');
const Router = require('react-router');
const auth = require('./auth');
const dateUtil = require('../date');
const api = require('./api');
const GoodThing = require('./good-thing');
const Loading = require('./loading');
const Link = Router.Link;

var Day = module.exports = React.createClass({
  getInitialState: function() {
    [ date, today ] = extractDate(this.props.params.date);
    return {
      loading: true,
      date: date,
      goodThings: [],
      today: today,
      editIndex: extractEditIndex(this.props.params.editIndex)
    };
  },
  componentWillMount: function() {
    this.loadData();
  },
  handleUpdateGoodThing: function() {
    this.state.editIndex = null;
    this.loadData();
  },
  handleEditGoodThing: function(index) {
    this.setState({
      editIndex: index
    });
  },
  componentWillReceiveProps: function(nextProps) {
    [ date, today ] = extractDate(nextProps.params.date);
    this.setState({
		date: date,
		today: today,
		loading: true,
      	editIndex: extractEditIndex(nextProps.params.editIndex)
	}, function() {
    	this.loadData();
	});
  },
  loadData: function() {
    var component = this;
    loadGoodThings(this.state.date, this.state.today, this.state.editIndex).then(function({goodThings, editIndex}) {
      component.setState({
        loading: false,
        goodThings: goodThings,
        editIndex: editIndex
      });
    });
  },
  render: function() {
    if(this.state.loading) {
      return <Loading/>;
    }
    return <DayComponent
      today={this.state.today}
      date={this.state.date}
      editIndex={this.state.editIndex}
      onUpdateGoodThing={this.handleUpdateGoodThing}
      onEditGoodThing={this.handleEditGoodThing}
      goodThings={this.state.goodThings}/>;
  }
});

function DayComponent(props) {
  var nextDay = dateUtil.stringify(dateUtil.nextDay(props.date));
  var prevDay = dateUtil.stringify(dateUtil.previousDay(props.date));
  return (
    <div className="day">
      <div className="nav">
        <div className="inner">
          <Link to={'/day/' + prevDay} className="prev"><span>Previous Day</span></Link>
          {(props.today && 'Today') || dateUtil.niceFormat(props.date)}
          { props.today || <Link to={'/day/' + nextDay} className="next"><span>Next Day</span></Link> }
        </div>
      </div>
      <ul className="inner">
        {props.goodThings.map((goodThing, index) => (
          <GoodThing number={index + 1}
            date={props.date}
            editing={index === props.editIndex}
            onUpdateGoodThing={props.onUpdateGoodThing}
            onEditGoodThing={props.onEditGoodThing}
            goodThing={goodThing}
            key={goodThing.id || goodThing.key}/>
        ))}
      </ul>
    </div>
  );
}


function extractDate(initial) {
  var today = dateUtil.today();
  var date = dateUtil.extract(initial, true) || today;
  return [ date, (date.valueOf() == today.valueOf()) ];
}

function loadGoodThings(date, today, editIndex) {
  var call = api.get('/good-things/' + dateUtil.stringify(date));
  return call.then(function(response) {
    return response.json();
  }).then(function(result) {
    return result.goodThings;
  }).catch(function (err) {
    return [];
  }).then(function(goodThings) {
    return finalizeThings(goodThings, today, editIndex);
  });
}

function finalizeThings(goodThings, today, editIndex) {
  goodThings.map(function(goodThing, index) {
    goodThing.id = goodThing._id;
  });
  if (goodThings.length < 3) {
    var newIndex = goodThings.length + 1;
    var newThing = {
      id: null,
      title: '',
      details: '',
      key: goodThings.length + 1,
    };
    editIndex = editIndex || goodThings.length;
    goodThings.push(newThing);
  }
  return { goodThings: goodThings, editIndex: editIndex };
}

function extractEditIndex(initial){
    var editIndex = parseInt(initial);
    switch(editIndex) {
      case 0:
      case 1:
      case 2:
        //  already set
        break;
      default:
        editIndex = null;
        break;
    }
    return editIndex;
}
