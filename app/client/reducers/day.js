import Immutable from 'immutable'
import * as actions from '../actions/day'
import dateUtil from '../../date'

const dateReducer = function (state = Immutable.fromJS({}), action) {
  switch (action.type) {
    case actions.DAY_LOAD_REQUEST:
    case actions.DAY_LOAD_SUCCESS:
    case actions.DAY_LOAD_ERROR:
    case actions.DAY_INVALIDATE:
      let date = dateUtil.stringify(action.payload.date)
      let dateState = singleDateReducer(state.get(date) || undefined, action)
      return state.set(date, dateState)
    default:
      return state
  }
}

const initialDateState = Immutable.fromJS({
  loading: false,
  error: null,
  invalidated: true,
  goodThings: []
})
const singleDateReducer = function (state = initialDateState, action) {
  switch (action.type) {
    case actions.DAY_LOAD_REQUEST:
      return state.set('loading', true)
                  .set('error', null)
    case actions.DAY_LOAD_SUCCESS:
      return state.set('loading', false)
                  .set('invalidated', false)
                  .set('error', null)
                  .set('goodThings', action.payload.goodThings.map(thing => thing._id))
    case actions.DAY_LOAD_ERROR:
      return state.set('loading', false)
                  .set('error', action.payload.error)
    case actions.DAY_INVALIDATE:
      return state.set('invalidated', true)
    default:
      return state
  }
}

export default dateReducer

