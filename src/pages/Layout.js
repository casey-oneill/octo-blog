import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Status } from '../util/constants';
import ErrorPage from './ErrorPage';

const Layout = () => {
	const postsStatus = useSelector(state => state.posts.status);
	const postsError = useSelector(state => state.posts.error);
	const categoriesStatus = useSelector(state => state.categories.status);
	const categoriesError = useSelector(state => state.categories.error);
	const userStatus = useSelector(state => state.user.status);
	const userError = useSelector(state => state.user.error);

	console.log(userError)

	if (postsStatus === Status.Error) {
		<div className="d-flex flex-column min-vh-100">
			<ErrorPage error={postsError} />
		</div>
	}

	if (categoriesStatus === Status.Error) {
		<div className="d-flex flex-column min-vh-100">
			<ErrorPage error={categoriesError} />
		</div>
	}

	if (userStatus === Status.Error) {
		<div className="d-flex flex-column min-vh-100">
			<ErrorPage error={userError} />
		</div>
	}

	return (
		<div className="d-flex flex-column min-vh-100">
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
};

export default Layout;
