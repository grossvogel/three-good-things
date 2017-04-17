import { createAction } from 'redux-actions'
import { goodThingsFetched } from './good-thing'
import api from '../api'

export const HISTORY_REQUEST = Symbol('HistoryRequest')
export const HISTORY_SUCCESS = Symbol('HistorySuccess')
export const HISTORY_ERROR = Symbol('HistoryError')
export const HISTORY_INVALIDATE = Symbol('HistoryInvalidate')

export const historyRequest = createAction(HISTORY_REQUEST)
export const historySuccess = createAction(HISTORY_SUCCESS)
export const historyError = createAction(HISTORY_ERROR)
export const historyInvalidate = createAction(HISTORY_INVALIDATE)

export const loadHistory = () => {
  return (dispatch, getState) => {
    if (shouldFetchHistory(getState())) {
      dispatch(historyRequest())
      var call = api.get('/good-things/history')
      return call.then(function (result) {
        dispatch(goodThingsFetched(result.goodThings))
        dispatch(historySuccess(result.goodThings))
        return result.goodThings
      }).catch(function (err) {
        dispatch(historyError(err))
        return null
      })
    } else {
      return Promise.resolve()
    }
  }
}

function shouldFetchHistory (state) {
  let history = state.get('history') || new Map({invalidated: true})
  return history.get('invalidated')
}
