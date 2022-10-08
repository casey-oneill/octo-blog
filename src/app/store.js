import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesSlice';
import postsReducer from '../features/posts/postsSlice';
import userReducer from '../features/user/userSlice';

export default configureStore({
	reducer: {
		categories: categoriesReducer,
		posts: postsReducer,
		user: userReducer,
	},
});
