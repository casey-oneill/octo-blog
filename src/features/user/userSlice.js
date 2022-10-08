import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildOctokit } from "../../util/util";

const initialState = {
	user: null,
	status: 'idle',
	error: null,
};

export const fetchUser = createAsyncThunk('/user/fetchUser', async () => {
	const octokit = await buildOctokit();
	const user = await octokit.request("GET /user", {});

	return user.data;
});

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUser.pending, (state, action) => {
				state.status = 'loading';
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.user = action.payload;
			})
			.addCase(fetchUser.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			});
	}
});

export default userSlice.reducer;
