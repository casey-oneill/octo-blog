import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
	return (
		<Container className="not-found py-5 text-center">
			<h1 className="mb-5">Page Not Found</h1>
			<p>We can't seem to find the page you're looking for.</p>
			<Button as={Link} variant="primary" to="/">Go Home</Button>
		</Container>
	);
}

export default NotFoundPage;
