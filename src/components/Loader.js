import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
	return (
		<div className="d-flex justify-content-center">
			<Spinner animation="border" role="status" variant="primary">
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		</div>
	);
};

export default Loader;
