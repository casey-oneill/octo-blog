import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../util/constants';
import { buildOctokit } from '../../util/util';

const initialState = {
	posts: [],
	complete: false,
	status: STATUS.IDLE,
	error: null,
};

const fetchPostContent = async (postPath) => {
	console.log(postPath)
	const octokit = await buildOctokit();
	const metadata = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: postPath,
	});

	const decodedContent = atob(metadata.data.content); // FIXME: deprecated method
	return decodedContent;
}

const fetchPostCommits = async (postPath) => {
	const octokit = await buildOctokit();
	const commits = await octokit.request('GET /repos/{owner}/{repo}/commits{?path}', {
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: postPath,
	});

	return commits.data;
}

export const fetchPost = createAsyncThunk('posts/fetchPost', async (postPath) => {
	const octokit = await buildOctokit();
	const content = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: postPath,
	});

	let post = content.data;
	const postContent = await fetchPostContent(post.path);
	const postCommits = await fetchPostCommits(post.path);
	post.content = postContent;
	post.commits = postCommits;

	return post;
});

export const fetchCategoryPosts = createAsyncThunk('/posts/fetchCategoryPosts', async (categoryPath) => {
	const octokit = await buildOctokit();
	const content = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: categoryPath,
	});

	let posts = content.data;
	for (let i = 0; i < posts.length; i++) {
		const path = posts[i].path;

		const content = await fetchPostContent(path);
		posts[i].content = content;

		const commits = await fetchPostCommits(path);
		posts[i].commits = commits;
	}

	return posts;
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	// Fetch all posts and categories from /blog
	const octokit = await buildOctokit();
	const content = await octokit.request('GET /repos/{owner}/{repo}/contents/blog/', {
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
	});

	let posts = [];
	let categories = [];

	content.data.forEach((c) => {
		if (c.download_url === null) {
			categories.push(c);
		} else {
			posts.push(c);
		}
	});

	// Fetch all posts for each category
	for (var i = 0; i < categories.length; i++) {
		const content = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
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

		const content = await fetchPostContent(path);
		posts[i].content = content;

		const commits = await fetchPostCommits(path);
		posts[i].commits = commits;
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
				state.status = STATUS.SUCCEEDED;
				state.complete = true;
				state.posts = action.payload;
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = STATUS.FAILED;
				state.error = action.error.message;
			})
			.addCase(fetchPost.pending, (state, action) => {
				state.status = STATUS.LOADING;
			})
			.addCase(fetchPost.fulfilled, (state, action) => {
				state.status = STATUS.SUCCEEDED;
				state.posts = state.posts.concat(action.payload);
			})
			.addCase(fetchPost.rejected, (state, action) => {
				state.status = STATUS.FAILED;
				state.error = action.error.message;
			})
			.addCase(fetchCategoryPosts.pending, (state, action) => {
				state.status = STATUS.LOADING;
			})
			.addCase(fetchCategoryPosts.fulfilled, (state, action) => {
				state.status = STATUS.SUCCEEDED;
				state.posts = state.posts.concat(action.payload);
			})
			.addCase(fetchCategoryPosts.rejected, (state, action) => {
				state.status = STATUS.FAILED;
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
