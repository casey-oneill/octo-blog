import React from 'react';
import { Alert, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const PageFallback = () => {
	return (
		<Container className="not-found py-5 text-center">
			<h1 className="mb-5">Oops! Something went wrong.</h1>
			<Alert variant="danger">Try reloading the page.</Alert>
			<Button as={Link} variant="primary" to="/">Go Home</Button>
		</Container>
	)
}

export default PageFallback;
