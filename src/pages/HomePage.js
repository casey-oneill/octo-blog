import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import CategoriesList from '../features/categories/CategoriesList';
import PostsList from '../features/posts/PostsList';

const HomePage = () => {
	return (
		<Container className="home py-5">
			<h1 className="text-center mb-5">Blog Posts</h1>
			<Row>
				<Col xs={12} lg={3}>
					<CategoriesList />
				</Col>
				<Col xs={12} lg={9}>
					<PostsList />
				</Col>
			</Row>
		</Container>
	);
};

export default HomePage;
