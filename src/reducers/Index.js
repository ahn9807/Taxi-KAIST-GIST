import { combineReducers } from 'redux'
import AuthReducer from './AuthReducer'

const appReducers = combineReducers({
    AuthReducer,
})

export default appReducers