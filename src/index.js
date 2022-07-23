import React from 'react';
import ReactDOM from 'react-dom/client';
// import "bootswatch/dist/litera/bootstrap.min.css"; // TODO: Get theme from .env file
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import AboutPage from './pages/AboutPage';

const PostPageWrapper = (props) => {
	const params = useParams();
	return (
		<PostPage {...{ ...props, match: { params } }} />
	);
};

const root = ReactDOM.createRoot(
	document.getElementById("root")
);

root.render(
	<BrowserRouter basename="/octo-blog">
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="/" element={<HomePage />} />
				<Route path="posts">
					<Route path=":path" element={<PostPageWrapper />} />
				</Route>
				<Route path="about" element={<AboutPage />} />
			</Route>
		</Routes>
	</BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
