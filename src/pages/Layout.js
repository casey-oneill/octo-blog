import React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import PageFallback from './PageFallback';

const Layout = () => {

	return (
		<div className="d-flex flex-column min-vh-100">
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
};

export default withErrorBoundary(Layout, { FallbackComponent: PageFallback });
