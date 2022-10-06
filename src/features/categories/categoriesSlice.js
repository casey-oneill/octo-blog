import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildOctokit } from "../../util/util";

const initialState = {
	categories: [],
	status: 'idle',
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
	const content = await octokit.request("GET /repos/{owner}/{repo}/contents/blog/", {
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
	reducers: {
		categoryAdded: (state, action) => {
			state.categories.push(action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCategories.pending, (state, action) => {
				state.status = 'loading';
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.status = 'suceeded';
				state.categories = state.categories.concat(action.payload);
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			});
	}
});

export const { categoryAdded } = categoriesSlice.actions;

export default categoriesSlice.reducer;

export const selectAllCategories = (state) => state.categories.categories;
