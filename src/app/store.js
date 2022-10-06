import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from '../features/categories/categoriesSlice';

export default configureStore({
	reducer: {
		categories: categoriesReducer,
	},
});
