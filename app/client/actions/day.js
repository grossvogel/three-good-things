import { createAction } from 'redux-actions'
import { goodThingsFetched } from './good-thing'
import api from '../api'
import dateUtil from '../../date'

export const DAY_LOAD_REQUEST = Symbol('DayLoadRequest')
export const DAY_LOAD_SUCCESS = Symbol('DayLoadSuccess')
export const DAY_LOAD_ERROR = Symbol('DayLoadError')
export const DAY_INVALIDATE = Symbol('DayInvalidate')

export const dayLoadRequest = createAction(DAY_LOAD_REQUEST)
export const dayLoadSuccess = createAction(DAY_LOAD_SUCCESS)
export const dayLoadError = createAction(DAY_LOAD_ERROR)
export const dayInvalidate = createAction(DAY_INVALIDATE)

export const loadDay = (date) => {
  return (dispatch, getState) => {
    if (shouldFetchDay(getState(), date)) {
      dispatch(dayLoadRequest({date}))
      return loadGoodThings(date).then(goodThings => {
        dispatch(goodThingsFetched(goodThings))
        dispatch(dayLoadSuccess({date, goodThings}))
      }).catch(error => {
        dispatch(dayLoadError({date, error}))
      })
    } else {
      return Promise.resolve()
    }
  }
}

function shouldFetchDay (state, date) {
  let days = state.get('day')
  let day = days ? days.get(dateUtil.stringify(date)) : null
  return !day || !day.has('invalidated') || day.get('invalidated')
}

function loadGoodThings (date) {
  var call = api.get('/good-things/' + dateUtil.stringify(date))
  return call.then(function (result) {
    return result.goodThings
  }).catch(function (err) {
    console.log(err)
    return []
  })
}

