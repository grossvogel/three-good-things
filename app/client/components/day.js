const React = require('react')
const Router = require('react-router')
const dateUtil = require('../../date')
const GoodThing = require('../containers/good-thing')
const Link = Router.Link

module.exports = function DayComponent (props) {
  var nextDay = dateUtil.stringify(dateUtil.nextDay(props.date))
  var prevDay = dateUtil.stringify(dateUtil.previousDay(props.date))
  return (
    <div className='day'>
      <div className='nav'>
        <div className='inner'>
          <Link to={'/day/' + prevDay} className='prev'><span>Previous Day</span></Link>
          {(props.today && 'Today') || dateUtil.niceFormat(props.date)}
          { props.today || <Link to={'/day/' + nextDay} className='next'><span>Next Day</span></Link> }
        </div>
      </div>
      <ul className='inner goodThingList'>
        {props.goodThings.map((goodThing, index) => (
          <GoodThing number={index + 1}
            date={props.date}
            editing={index === props.editIndex}
            onUpdateGoodThing={props.onUpdateGoodThing}
            onClickGoodThing={props.onClickGoodThing}
            goodThing={goodThing}
            key={goodThing.id || goodThing.key} />
        ))}
        {props.goodThings.length === 0 && <li className='empty'>
          Awww... No good things recorded
        </li>}
      </ul>
      <div className='historyLink inner'>
        <Link to='/history'>View History</Link>
      </div>
    </div>
  )
}
