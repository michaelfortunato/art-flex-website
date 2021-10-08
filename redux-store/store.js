import { configureStore, combineReducers } from '@reduxjs/toolkit'
import accountReducer from './features/account/accountSlice'
export default configureStore({
	reducer: combineReducers({
		account: accountReducer
	})
})