import { combineReducers } from 'redux-immutable'
import history from './history'
import day from './day'
import user from './user'
import goodThings from './good-thing'

export default combineReducers({
  goodThings,
  user,
  history,
  day
})
