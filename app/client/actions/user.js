import { createAction } from 'redux-actions'

export const USER_UPDATE = Symbol()

export const userUpdate = createAction(USER_UPDATE)

