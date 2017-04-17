import { createAction } from 'redux-actions'
import { historyInvalidate } from './history'
import { dayInvalidate } from './day'
import api from '../api'
import dateUtil from '../../date'

export const GOOD_THINGS_FETCHED = Symbol('GoodThingsFetched')
export const goodThingsFetched = createAction(GOOD_THINGS_FETCHED)

export const saveGoodThing = (goodThing) => {
  return (dispatch) => {
    let isNew = !goodThing.id
    return doSave(goodThing).then(savedGoodThing => {
      dispatch(goodThingsFetched([savedGoodThing]))
      if (isNew) {
        let date = savedGoodThing.day
        dispatch(historyInvalidate())
        dispatch(dayInvalidate({ date }))
      }
      return savedGoodThing
    })
  }
}

function doSave (data) {
  data.day = dateUtil.stringify(data.day)
  return api.post('/good-things', data).then(function (result) {
    return result.goodThing
  })
}
