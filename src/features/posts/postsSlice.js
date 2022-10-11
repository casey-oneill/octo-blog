import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../util/constants';
import { buildCategoryPath, buildOctokit } from '../../util/util';

const initialState = {
	posts: [],
	status: STATUS.IDLE,
	error: null,
};

const fetchPostContent = async (path) => {
	const octokit = await buildOctokit();
	const contents = await octokit.rest.repos.getContent({
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: path,
	});

	return atob(contents.data.content);
}

const fetchPostCommits = async (path) => {
	const octokit = await buildOctokit();
	const commits = await octokit.rest.repos.listCommits({
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: path,
	});

	return commits.data;
};

export const fetchPost = createAsyncThunk('posts/fetchPost', async (path) => {
	const octokit = await buildOctokit();
	const contents = await octokit.rest.repos.getContent({
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: path,
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
	const contents = await octokit.rest.repos.getContent({
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: path,
	});

	const posts = await Promise.all(contents.data.map(async post => {
		const path = post.path;
		const commits = await fetchPostCommits(path);
		return {
			...post,
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
	const contents = await octokit.rest.repos.getContent({
		owner: process.env.REACT_APP_GH_OWNER,
		repo: process.env.REACT_APP_GH_REPO,
		path: 'blog',
	});

	let posts = contents.data.filter(content => content.type === 'file');
	const categories = contents.data.filter(content => content.type === 'dir');

	for (var i = 0; i < categories.length; i++) {
		const categoryPosts = await fetchCategoryPosts(categories[i].name);
		posts = posts.concat(categoryPosts);
	}

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
				if (state.posts.find(post => post.name === action.payload.name) === undefined) {
					state.posts = state.posts.concat(action.payload);
				}
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
	return category === undefined ? state.posts.posts : state.posts.posts.filter(post => post.path.includes(category));
};

export const selectPostByPath = (state, path) => state.posts.posts.find(post => post.path === path);

export const selectPostByName = (state, name) => state.posts.posts.find(post => post.name === name);
