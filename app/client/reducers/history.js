import Immutable from 'immutable'
import * as actions from '../actions/history'

const initialState = Immutable.fromJS({
  loading: true,
  error: null,
  invalidated: true,
  goodThings: []
})

const historyReducer = function (state = initialState, action) {
  switch (action.type) {
    case actions.HISTORY_REQUEST:
      return state.set('loading', true)
                  .set('error', null)
    case actions.HISTORY_SUCCESS:
      return state.set('loading', false)
                  .set('invalidated', false)
                  .set('error', null)
                  .set('goodThings', action.payload.map(thing => thing._id))
    case actions.HISTORY_ERROR:
      return state.set('loading', false)
                  .set('error', action.payload)
    case actions.HISTORY_INVALIDATE:
      return state.set('invalidated', true)
    default:
      return state
  }
}

export default historyReducer
