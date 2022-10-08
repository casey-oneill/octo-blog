import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../../util/constants";
import { buildOctokit } from "../../util/util";

const initialState = {
	posts: [],
	status: STATUS.IDLE,
	error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	// Fetch all posts and categories from /blog
	const octokit = await buildOctokit();
	const content = await octokit.request("GET /repos/{owner}/{repo}/contents/blog/", {
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
	});

	var posts = [];
	var categories = [];

	content.data.forEach((c) => {
		if (c.download_url === null) {
			categories.push(c);
		} else {
			posts.push(c);
		}
	});

	// Fetch all posts for each category
	for (var i = 0; i < categories.length; i++) {
		const content = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
			path: categories[i].path,
		});

		posts = posts.concat(content.data);
	}

	// Fetch content and commits for all posts
	// TODO: Fetch on request, rather than all at once
	for (var i = 0; i < posts.length; i++) {
		const path = posts[i].path;
		// Fetch post content
		const metadata = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
			path: path,
		});
		const content = atob(metadata.data.content); // FIXME: Deprecated method
		posts[i].content = content;

		const commits = await octokit.request("GET /repos/{owner}/{repo}/commits{?path}", {
			owner: process.env.REACT_APP_GH_OWNER,
			repo: process.env.REACT_APP_GH_REPO,
			path: path,
		});
		posts[i].commits = commits.data;
	}

	return posts;
});

export const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPosts.pending, (state, action) => {
				state.status = STATUS.LOADING;
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.posts = state.posts.concat(action.payload);
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
	}
});

export default postsSlice.reducer;

export const selectAllPosts = state => state.posts.posts;

export const selectPostsByCategory = (state, category) => {
	if (category === undefined) {
		return state.posts.posts;
	} else {
		return state.posts.posts.filter(post => post.path.includes(category));
	}
};

export const selectPostByPath = (state, path) => state.posts.posts.find(post => post.path === path);

export const selectPostByName = (state, name) => state.posts.posts.find(post => post.name === name);
