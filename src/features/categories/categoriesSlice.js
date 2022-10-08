import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../util/constants';
import { buildOctokit } from '../../util/util';

const initialState = {
	categories: [],
	status: STATUS.IDLE,
	error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
	const parseCategory = (post) => {
		if (post.download_url === null) {
			const dirname = post.path.split("/")[1];
			return {
				dirname: dirname,
				name: dirname.split("-").join(" "),
			}
		}
		return null;
	};

	const octokit = await buildOctokit();
	const content = await octokit.request('GET /repos/{owner}/{repo}/contents/blog/', {
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
	});

	var categories = [];
	content.data.forEach((post) => {
		const category = parseCategory(post);
		if (category !== null && categories.indexOf(category) === -1) {
			categories.push(category);
		}
	});

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
