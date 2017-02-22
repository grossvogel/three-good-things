const React = require('react');
const auth = require('./auth');
const dateUtil = require('../date');
const api = require('./api');
const GoodThing = require('./good-thing');
const NotificationButton = require('./notification-button');

var Day = module.exports = React.createClass({
  getInitialState: function() {
    [ date, today ] = extractDate(this.props.params.date);
    return {
      loaded: false,
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
  handleNav: function(e) {
    e.preventDefault();
    var newDate;
    if (e.target.getAttribute('href') == '#next') {
      newDate = dateUtil.nextDay(this.state.date);
    } else {
      newDate = dateUtil.previousDay(this.state.date);
    }
    var dest = '/day/' + dateUtil.stringify(newDate);
    this.props.router.push(dest);
  },
  componentWillReceiveProps: function(nextProps) {
    console.log(nextProps.params);
    [ date, today ] = extractDate(nextProps.params.date);
    this.setState({
      date: date,
      today: today,
      editIndex: null
    });
    this.loadData();
  },
  loadData: function() {
    var component = this;
    loadGoodThings(this.state.date, this.state.today, this.state.editIndex).then(function({goodThings, editIndex}) {
      component.setState({
        loaded: true,
        goodThings: goodThings,
        editIndex: editIndex
      });
    });
  },
  render: function() {
    return <DayComponent
      today={this.state.today}
      date={this.state.date}
      editIndex={this.state.editIndex}
      onNav={this.handleNav}
      onUpdateGoodThing={this.handleUpdateGoodThing}
      onEditGoodThing={this.handleEditGoodThing}
      goodThings={this.state.goodThings}/>;
  }
});

function DayComponent(props) {
  return (
    <div className="day">
      <div className="nav">
        <div className="inner">
          <a href="#prev" className="prev" onClick={props.onNav}>Prev</a>
          {(props.today && 'Today') || dateUtil.niceFormat(props.date)}
          { props.today || <a href="#next" className="next" onClick={props.onNav}>Next</a> }
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
	  <NotificationButton/>
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
