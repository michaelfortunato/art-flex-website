import { createSlice } from '@reduxjs/toolkit'

export const accountSlice = createSlice({
	name: "account",
	initialState: {
		name: null,
		email: null
	},
	reducers: {
		signIn: (state, action) => {
			// From the redux tutorial, helpful for me
			// ""Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes""
			state.name = action.payload.name;
			state.email = action.payload.email;
		},
		signOut: state => {
			state.email = null
		}
	}
})

export const {signIn, signOut} = accountSlice.actions;

export default accountSlice.reducer;