import React from 'react';
import { Card } from 'react-bootstrap';

var Remarkable = require('react-remarkable');

const Post = (props) => {
	const { content } = props;

	return (
		<div className="post">
			<Card>
				<Card.Body>
					<Card.Text as={Remarkable} source={content} />
				</Card.Body>
			</Card>
		</div>
	);
};

export default Post;
