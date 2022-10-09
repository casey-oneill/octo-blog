import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../util/constants';
import { buildCategoryPath, buildOctokit } from '../../util/util';

const initialState = {
	posts: [],
	status: STATUS.IDLE,
	error: null,
};

const fetchPostContent = async (postPath) => {
	const octokit = await buildOctokit();
	const contents = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: postPath,
	});

	return atob(contents.data.content); // FIXME: deprecated method
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
	const contents = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: postPath,
	});

	const post = contents.data;
	const content = atob(post.content);
	const commits = await fetchPostCommits(post.path);
	return {
		...post,
		content: content,
		commits: commits,
	};
});

const fetchCategoryPosts = async (category) => {
	const octokit = await buildOctokit();

	const path = buildCategoryPath(category);
	const content = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: path,
	});

	const posts = await Promise.all(content.data.map(async post => {
		const path = post.path;
		const content = await fetchPostContent(path);
		const commits = await fetchPostCommits(path);
		return {
			...post,
			content: content,
			commits: commits,
		};
	}));

	return posts;
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (category) => {
	if (category !== undefined) {
		const posts = await fetchCategoryPosts(category);
		return posts;
	}

	const octokit = await buildOctokit();
	const contents = await octokit.request('GET /repos/{owner}/{repo}/contents/blog/', {
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
	});

	let posts = contents.data.filter(content => content.type === 'file');
	const categories = contents.data.filter(content => content.type === 'dir');

	for (var i = 0; i < categories.length; i++) {
		const categoryPosts = await fetchCategoryPosts(categories[i].name);
		posts = posts.concat(categoryPosts);
	}

	// TODO: Fetch on request, rather than all at once
	posts = await Promise.all(posts.map(async post => {
		const path = post.path;
		const content = await fetchPostContent(path);
		const commits = await fetchPostCommits(path);
		return {
			...post,
			content: content,
			commits: commits,
		};
	}));

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
