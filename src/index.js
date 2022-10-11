import React from 'react';
import ReactDOM from 'react-dom/client';
// import 'bootswatch/dist/litera/bootstrap.min.css'; // TODO: Get theme from .env file
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import CategoryPage from './features/categories/CategoryPage';
import { Provider } from 'react-redux';
import store from './app/store';
import PostPage from './features/posts/PostPage';
import UserPage from './features/user/UserPage';
import NotFoundPage from './pages/NotFoundPage';

const CategoryPageWrapper = (props) => {
	const params = useParams();
	return (
		<CategoryPage {...{ ...props, match: { params } }} />
	);
};

const PostPageWrapper = (props) => {
	const params = useParams();
	return (
		<PostPage {...{ ...props, match: { params } }} />
	);
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<Provider store={store}>
		<BrowserRouter basename="/octo-blog">
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="categories">
						<Route path=":path" element={<CategoryPageWrapper />} />
					</Route>
					<Route path="posts">
						<Route path=":path" element={<PostPageWrapper />} />
					</Route>
					<Route path="posts">
						<Route path=":category">
							<Route path=":path" element={<PostPageWrapper />} />
						</Route>
					</Route>
					<Route path="about" element={<UserPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</Provider>
);
