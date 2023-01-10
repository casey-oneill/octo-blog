import React from 'react';
import { Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const PostsListFallback = (props) => {
	const { error } = props;
	const serviceError = useSelector(state => state.posts.error);
	return (
		<Alert variant="danger">
			<Alert.Heading>Oops, something went wrong!</Alert.Heading>
			<p>Unable to retrieve posts.</p>
			<hr />
			<p className="mb-0">Additional information: {serviceError || error.message}</p>
		</Alert>
	);
};

export default PostsListFallback;
