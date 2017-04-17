import Immutable from 'immutable'
import * as actions from '../actions/good-thing'

const goodThingReducer = function (state = Immutable.fromJS({}), action) {
  switch (action.type) {
    case actions.GOOD_THINGS_FETCHED:
      return state.withMutations(map => {
        action.payload.forEach(thing => {
          map.set(thing._id, thing)
        })
      })
    default:
      return state
  }
}

export default goodThingReducer
