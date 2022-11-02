import React from 'react';
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const ErrorPage = (props) => {
	const { error } = props;

	return (
		<Container className="not-found py-5 text-center">
			<h1 className="mb-5">Error!</h1>
			<p>{error}</p>
			<Button as={Link} variant="primary" to="/">Go Home</Button>
		</Container>
	)
}

export default ErrorPage;
