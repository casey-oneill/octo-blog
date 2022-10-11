import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../util/constants';
import { buildOctokit } from '../../util/util';

const initialState = {
	categories: [],
	status: STATUS.IDLE,
	error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
	const octokit = await buildOctokit();
	const contents = await octokit.rest.repos.getContent({
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: 'blog',
	});

	const categories = contents.data.filter(content => content.type === 'dir');
	return categories;
});

export const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCategories.pending, (state, action) => {
				state.status = STATUS.LOADING;
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.status = STATUS.SUCCEEDED;
				state.categories = action.payload;
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.status = STATUS.FAILED;
				state.error = action.error.message;
			});
	}
});

export default categoriesSlice.reducer;

export const selectAllCategories = state => state.categories.categories;
