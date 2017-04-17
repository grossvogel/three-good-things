import Immutable from 'immutable'
import * as actions from '../actions/user'

const initialState = Immutable.fromJS({
  id: null
})

const userReducer = function (state = initialState, action) {
  switch (action.type) {
    case actions.USER_UPDATE:
      return state.set('id', action.payload || null)
    default:
      return state
  }
}

export default userReducer

