import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { fetchCategories } from "../features/categories/categoriesSlice";
import { fetchPosts } from "../features/posts/postsSlice";

const Layout = () => {
	const dispatch = useDispatch();
	const categoriesStatus = useSelector((state) => state.categories.status);
	const postsStatus = useSelector((state) => state.posts.status);

	useEffect(() => {
		if (categoriesStatus === 'idle') {
			dispatch(fetchCategories());
		}
	}, [categoriesStatus, dispatch]);

	useEffect(() => {
		if (postsStatus === 'idle') {
			dispatch(fetchPosts());
		}
	}, [postsStatus, dispatch]);

	return (
		<div className="d-flex flex-column min-vh-100">
			<Header />
			{(categoriesStatus !== 'idle' && postsStatus !== 'idle') && <Outlet />}
			<Footer />
		</div>
	);
};

export default Layout;
